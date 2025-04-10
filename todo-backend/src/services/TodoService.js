class TodoService {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }

    getAllTodos() {
        try {
            return this.todos;
        } catch (error) {
            throw error;
        }
    }

    getTodoById(id) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            return todo;
        } catch (error) {
            throw error;
        }
    }

    createTodo({ description, category, expirationDate }) {
        try {
            const todo = {
                id: this.nextId++,
                description,
                category,
                creationDate: new Date(),
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                state: 'active'
            };
            this.todos.push(todo);
            return todo;
        } catch (error) {
            throw error;
        }
    }

    updateTodo(id, updates) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            if (!todo) {
                
                return null;
            }

            Object.assign(todo, updates);
            return todo;
        } catch (error) {
            throw error;
        }
    }

    deleteTodo(id) {
        try {
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index === -1) {
                return false;
            }
            
            this.todos.splice(index, 1);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

const todoService = new TodoService();
module.exports = { todoService };