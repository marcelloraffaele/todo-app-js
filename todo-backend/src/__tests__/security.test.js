const request = require('supertest');
const { gzipSync } = require('node:zlib');

jest.mock('../util/app-insights', () => ({
    initializeAppInsights: jest.fn(),
    getTracer: jest.fn()
}));
jest.mock('../services/todoServiceFactory', () => {
    const TodoServiceLocal = require('../services/TodoServiceLocal');
    return { todoService: new TodoServiceLocal() };
});

describe('API security and compatibility', () => {
    let app;
    let originalOrigins;
    let errorLog;

    beforeAll(() => {
        originalOrigins = process.env.CORS_ORIGINS;
        process.env.CORS_ORIGINS = 'http://localhost:8080, https://example.com';
        app = require('../index');
        errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        if (originalOrigins === undefined) {
            delete process.env.CORS_ORIGINS;
        } else {
            process.env.CORS_ORIGINS = originalOrigins;
        }
        errorLog.mockRestore();
    });

    it('sets security headers without advertising Express', async () => {
        const response = await request(app).get('/todos').set('user_id', 'headers');
        expect(response.status).toBe(200);
        expect(response.headers['x-powered-by']).toBeUndefined();
        expect(response.headers['x-content-type-options']).toBe('nosniff');
        expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('preserves the missing identity response', async () => {
        const response = await request(app).get('/todos');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'USER_ID header is required' });
    });

    it('allows configured origins and the user_id preflight header', async () => {
        const response = await request(app).options('/todos')
            .set('Origin', 'http://localhost:8080')
            .set('Access-Control-Request-Method', 'POST')
            .set('Access-Control-Request-Headers', 'content-type,user_id');
        expect(response.status).toBe(204);
        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8080');
        expect(response.headers['access-control-allow-headers']).toContain('user_id');
    });

    it('does not enable CORS for unlisted origins', async () => {
        const response = await request(app).get('/todos')
            .set('user_id', 'cors')
            .set('Origin', 'https://untrusted.example');
        expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('returns sanitized JSON for malformed input', async () => {
        const response = await request(app).post('/todos').set('user_id', 'invalid')
            .set('Content-Type', 'application/json').send('{"description":');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid request body.' });
    });

    it('limits request bodies to 100 KiB', async () => {
        const response = await request(app).post('/todos').set('user_id', 'large')
            .send({ description: 'a'.repeat(100 * 1024) });
        expect(response.status).toBe(413);
        expect(response.body).toEqual({ message: 'Request body is too large.' });
    });

    it('rejects compressed bodies before decompression', async () => {
        const response = await request(app).post('/todos').set('user_id', 'compressed')
            .set('Content-Type', 'application/json').set('Content-Encoding', 'gzip')
            .send(gzipSync(Buffer.from('{"description":"test"}')));
        expect(response.status).toBe(415);
        expect(response.body).toEqual({ message: 'Unsupported request body encoding.' });
    });

    it('preserves CRUD and isolation while blocking protected and prototype fields', async () => {
        const created = await request(app).post('/todos').set('user_id', 'alice')
            .send({ description: 'Original' });
        expect(created.status).toBe(201);
        const id = created.body.id;
        const updated = await request(app).put(`/todos/${id}`).set('user_id', 'alice')
            .set('Content-Type', 'application/json')
            .send('{"description":"Updated","state":"done","id":999,"userId":"bob","creationDate":"bad","__proto__":{"polluted":true},"constructor":{"polluted":true}}');
        expect(updated.status).toBe(200);
        expect(updated.body).toEqual({
            ...created.body, description: 'Updated', state: 'done'
        });
        const otherUser = await request(app).get(`/todos/${id}`).set('user_id', 'bob');
        expect(otherUser.status).toBe(404);
        const removed = await request(app).delete(`/todos/${id}`).set('user_id', 'alice');
        expect(removed.status).toBe(204);
    });

    it('preserves the generated OpenAPI schema and Swagger UI', async () => {
        const spec = await request(app).get('/api-docs.json');
        expect(spec.status).toBe(200);
        expect(spec.body.openapi).toBe('3.0.0');
        expect(spec.body.paths['/todos'].post).toBeDefined();
        const docs = await request(app).get('/api-docs/');
        expect(docs.status).toBe(200);
        expect(docs.text).toContain('swagger-ui');
    });
});
