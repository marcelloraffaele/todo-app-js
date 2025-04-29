const TodoServiceBase = require('./TodoServiceBase');

class TodoServiceLocal extends TodoServiceBase {
    constructor() {
        super(); // Call base constructor if needed, though it's empty here
        // Use a Map to store todos for each user
        this.userTodos = new Map();
        this.nextId = 1; // Global nextId for simplicity, could be per-user
    }

    // Helper to get or initialize todos for a user
    _getUserTodos(userId) {
        if (!this.userTodos.has(userId)) {
            this.userTodos.set(userId, []);
        }
        return this.userTodos.get(userId);
    }

    getAllTodos(userId) {
        try {
            return this._getUserTodos(userId);
        } catch (error) {
            // Consider more specific error handling or logging
            console.error(`Error getting all todos for user ${userId}:`, error);
            throw new Error('Failed to retrieve todos.');
        }
    }

    getTodoById(userId, id) {
        try {
            const todos = this._getUserTodos(userId);
            const todo = todos.find(todo => todo.id === id);
            // No need to return if not found, find returns undefined which is falsy
            return todo;
        } catch (error) {
            console.error(`Error getting todo by id ${id} for user ${userId}:`, error);
            throw new Error('Failed to retrieve todo.');
        }
    }

    createTodo(userId, { description, category, expirationDate }) {
        try {
            const todos = this._getUserTodos(userId);
            const todo = {
                id: this.nextId++, // Use global ID for now
                description,
                category,
                creationDate: new Date(),
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                state: 'active'
            };
            todos.push(todo);
            return todo;
        } catch (error) {
            console.error(`Error creating todo for user ${userId}:`, error);
            throw new Error('Failed to create todo.');
        }
    }

    updateTodo(userId, id, updates) {
        try {
            const todos = this._getUserTodos(userId);
            const todo = todos.find(todo => todo.id === id);
            if (!todo) {
                return null; // Indicate not found
            }

            // Ensure ID and creationDate are not overwritten
            const safeUpdates = { ...updates }; // Clone updates
            delete safeUpdates.id;
            delete safeUpdates.creationDate;

            Object.assign(todo, safeUpdates);
            return todo;
        } catch (error) {
            console.error(`Error updating todo id ${id} for user ${userId}:`, error);
            throw new Error('Failed to update todo.');
        }
    }

    deleteTodo(userId, id) {
        try {
            const todos = this._getUserTodos(userId);
            const index = todos.findIndex(todo => todo.id === id);
            if (index === -1) {
                return false; // Indicate not found/not deleted
            }

            todos.splice(index, 1);
            return true; // Indicate successful deletion
        } catch (error) {
            console.error(`Error deleting todo id ${id} for user ${userId}:`, error);
            throw new Error('Failed to delete todo.');
        }
    }
}

// Export the class itself, not an instance
module.exports = TodoServiceLocal;