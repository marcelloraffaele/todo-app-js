const { initializeAppInsights, getTracer } = require('./util/app-insights.js');
initializeAppInsights();
const tracer = getTracer();

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
// Import the factory instead of the specific service
const { todoService } = require('./services/todoServiceFactory.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware to check for USER_ID header
const requireUserId = (req, res, next) => {
    const userId = req.headers['user_id'];
    if (!userId) {
        return res.status(404).json({ message: 'USER_ID header is required' });
    }
    req.userId = userId; // Attach userId to request object
    next();
};

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo API',
            version: '1.0.0',
            description: 'A simple Todo API'
        },
    },
    apis: ['./src/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Apply the middleware to all /todos routes
app.use('/todos', requireUserId);

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         creationDate:
 *           type: string
 *           format: date-time
 *         expirationDate:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *         state:
 *           type: string
 *           enum: [done, active, canceled]
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for the current user
 *     parameters:
 *       - in: header
 *         name: USER_ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request.
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       404:
 *         description: USER_ID header is missing
 */
// Make route handler async
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoService.getAllTodos(req.userId);
        res.json(todos);
    } catch (error) {
        console.error("Error in GET /todos:", error);
        res.status(500).json({ message: 'Failed to retrieve todos.' });
    }
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID for the current user
 *     parameters:
 *       - in: header
 *         name: USER_ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A todo object
 *       404:
 *         description: Todo not found or USER_ID header is missing
 */
// Make route handler async
app.get('/todos/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await todoService.getTodoById(req.userId, todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found for this user' });
        }
        res.json(todo);
    } catch (error) {
        console.error(`Error in GET /todos/${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to retrieve todo.' });
    }
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo for the current user
 *     parameters:
 *       - in: header
 *         name: USER_ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Created todo
 *       404:
 *         description: USER_ID header is missing
 */
// Make route handler async
app.post('/todos', async (req, res) => {
    try {
        const todo = await todoService.createTodo(req.userId, req.body);
        res.status(201).json(todo);
    } catch (error) {
        console.error("Error in POST /todos:", error);
        res.status(500).json({ message: 'Failed to create todo.' });
    }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo for the current user
 *     parameters:
 *       - in: header
 *         name: USER_ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *               state:
 *                 type: string
 *                 enum: [done, active, canceled]
 *     responses:
 *       200:
 *         description: Updated todo
 *       404:
 *         description: Todo not found for this user or USER_ID header is missing
 */
// Make route handler async
app.put('/todos/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await todoService.updateTodo(req.userId, todoId, req.body);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found for this user' });
        }
        res.json(todo);
    } catch (error) {
        console.error(`Error in PUT /todos/${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to update todo.' });
    }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo for the current user
 *     parameters:
 *       - in: header
 *         name: USER_ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the request.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found for this user or USER_ID header is missing
 */
// Make route handler async
app.delete('/todos/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const success = await todoService.deleteTodo(req.userId, todoId);
        if (!success) {
            return res.status(404).json({ message: 'Todo not found for this user' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(`Error in DELETE /todos/${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to delete todo.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});