const TodoServiceLocal = require('./TodoServiceLocal.js'); // Import the class

describe('TodoServiceLocal', () => {
    let todoService; // Declare variable to hold the service instance
    const testUserId = 'test-user'; // Define a test user ID

    beforeEach(() => {
        // Create a new instance for each test
        todoService = new TodoServiceLocal();
        // Resetting internal state is handled by creating a new instance
    });

    describe('createTodo', () => {
        it('should create a new todo with correct properties', () => {
            const todoData = {
                description: 'Test todo',
                category: 'test',
                expirationDate: '2025-12-31T23:59:59.999Z'
            };

            // Pass userId to the method
            const todo = todoService.createTodo(testUserId, todoData);

            expect(todo.id).toBe(1); // Assuming nextId starts at 1 globally or per instance
            expect(todo.description).toBe(todoData.description);
            expect(todo.category).toBe(todoData.category);
            expect(todo.expirationDate).toEqual(new Date(todoData.expirationDate));
            expect(todo.state).toBe('active');
        });
    });

    describe('getTodoById', () => {
        it('should return the correct todo by id', () => {
            // Pass userId when creating and getting
            const todo = todoService.createTodo(testUserId, { description: 'Test todo' });
            const found = todoService.getTodoById(testUserId, todo.id);
            expect(found).toEqual(todo);
        });

        it('should return undefined for non-existent todo', () => {
            // Pass userId when getting
            const found = todoService.getTodoById(testUserId, 999);
            expect(found).toBeUndefined();
        });
    });

    describe('updateTodo', () => {
        it('should update todo properties correctly', () => {
            // Pass userId when creating and updating
            const todo = todoService.createTodo(testUserId, { description: 'Original' });
            const updates = {
                description: 'Updated',
                category: 'test',
                state: 'done'
            };

            const updated = todoService.updateTodo(testUserId, todo.id, updates);

            expect(updated.description).toBe(updates.description);
            expect(updated.category).toBe(updates.category);
            expect(updated.state).toBe(updates.state);
        });

        it('should return null for non-existent todo', () => {
            // Pass userId when updating
            const result = todoService.updateTodo(testUserId, 999, { description: 'Test' });
            expect(result).toBeNull();
        });
    });

    describe('deleteTodo', () => {
        it('should delete existing todo', () => {
            // Pass userId when creating, deleting, and getting
            const todo = todoService.createTodo(testUserId, { description: 'To be deleted' });
            const result = todoService.deleteTodo(testUserId, todo.id);
            expect(result).toBe(true);
            expect(todoService.getTodoById(testUserId, todo.id)).toBeUndefined();
        });

        it('should return false for non-existent todo', () => {
            // Pass userId when deleting
            const result = todoService.deleteTodo(testUserId, 999);
            expect(result).toBe(false);
        });
    });
});