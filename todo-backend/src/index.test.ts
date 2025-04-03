import request from 'supertest';
import express, { Request, Response, RequestHandler } from 'express';
import { todoService } from './services/TodoService.js';
import cors from 'cors';
import { TodoInput, TodoState } from './models/Todo.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create a new express app instance for testing
const app = express();
app.use(cors());
app.use(express.json());

const getTodos: RequestHandler = (_req, res): void => {
    res.json(todoService.getAllTodos());
};

const getTodoById: RequestHandler = (req, res): void => {
    const todo = todoService.getTodoById(parseInt(req.params.id));
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    res.json(todo);
};

const createTodo: RequestHandler = (req, res): void => {
    const todo = todoService.createTodo(req.body as TodoInput);
    res.status(201).json(todo);
};

const updateTodo: RequestHandler = (req, res): void => {
    const todo = todoService.updateTodo(parseInt(req.params.id), req.body);
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    res.json(todo);
};

const deleteTodo: RequestHandler = (req, res): void => {
    const success = todoService.deleteTodo(parseInt(req.params.id));
    if (!success) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    res.status(204).send();
};

app.get('/todos', getTodos);
app.get('/todos/:id', getTodoById);
app.post('/todos', createTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);

describe('Todo API', () => {
    beforeEach(() => {
        // Reset the service before each test
        (todoService as any).todos = [];
        (todoService as any).nextId = 1;
    });

    describe('POST /todos', () => {
        it('should create a new todo', async () => {
            const todoData: TodoInput = {
                description: 'Test todo',
                category: 'test',
                expirationDate: '2025-12-31T23:59:59.999Z'
            };

            const response = await request(app)
                .post('/todos')
                .send(todoData)
                .expect(201);

            expect(response.body.description).toBe(todoData.description);
            expect(response.body.category).toBe(todoData.category);
            expect(new Date(response.body.expirationDate!)).toEqual(new Date(todoData.expirationDate!));
        });
    });

    describe('GET /todos', () => {
        it('should return all todos', async () => {
            // Create some test todos
            await request(app)
                .post('/todos')
                .send({ description: 'Todo 1' });
            await request(app)
                .post('/todos')
                .send({ description: 'Todo 2' });

            const response = await request(app)
                .get('/todos')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0].description).toBe('Todo 1');
            expect(response.body[1].description).toBe('Todo 2');
        });
    });

    describe('GET /todos/:id', () => {
        it('should return a specific todo', async () => {
            const createResponse = await request(app)
                .post('/todos')
                .send({ description: 'Test todo' });

            const response = await request(app)
                .get(`/todos/${createResponse.body.id}`)
                .expect(200);

            expect(response.body.description).toBe('Test todo');
        });

        it('should return 404 for non-existent todo', async () => {
            await request(app)
                .get('/todos/999')
                .expect(404);
        });
    });

    describe('PUT /todos/:id', () => {
        it('should update a todo', async () => {
            const createResponse = await request(app)
                .post('/todos')
                .send({ description: 'Original todo' });

            const response = await request(app)
                .put(`/todos/${createResponse.body.id}`)
                .send({ description: 'Updated todo', state: 'done' as TodoState })
                .expect(200);

            expect(response.body.description).toBe('Updated todo');
            expect(response.body.state).toBe('done');
        });

        it('should return 404 for non-existent todo', async () => {
            await request(app)
                .put('/todos/999')
                .send({ description: 'Updated todo' })
                .expect(404);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete a todo', async () => {
            const createResponse = await request(app)
                .post('/todos')
                .send({ description: 'To be deleted' });

            await request(app)
                .delete(`/todos/${createResponse.body.id}`)
                .expect(204);

            // Verify the todo is deleted
            await request(app)
                .get(`/todos/${createResponse.body.id}`)
                .expect(404);
        });

        it('should return 404 for non-existent todo', async () => {
            await request(app)
                .delete('/todos/999')
                .expect(404);
        });
    });
});