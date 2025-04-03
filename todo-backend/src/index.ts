import express, { Request, Response, RequestHandler } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { todoService } from './services/TodoService.js';
import { TodoInput } from './models/Todo.js';

// Import the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions class from the @azure/monitor-opentelemetry package.
import { useAzureMonitor, AzureMonitorOpenTelemetryOptions } from '@azure/monitor-opentelemetry';

// Create a new AzureMonitorOpenTelemetryOptions object.
const appInsightsConnectionString = process.env.APPINSIGHTS_CONNECTION_STRING;
const options: AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: {
    connectionString: appInsightsConnectionString,
  }
};
// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);

const app = express();

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
    apis: ['./src/index.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});