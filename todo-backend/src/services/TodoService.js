import appInsights from 'applicationinsights';
const client = appInsights.defaultClient;

class TodoService {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }

    getAllTodos() {
        try {
            client?.trackEvent({ name: "GetAllTodos" });
            return this.todos;
        } catch (error) {
            client?.trackException({ exception: error });
            throw error;
        }
    }

    getTodoById(id) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            client?.trackEvent({ 
                name: "GetTodoById",
                properties: { id, found: !!todo }
            });
            return todo;
        } catch (error) {
            client?.trackException({ exception: error });
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
            client?.trackEvent({ 
                name: "CreateTodo",
                properties: { 
                    todoId: todo.id,
                    category: category || 'undefined'
                }
            });
            return todo;
        } catch (error) {
            client?.trackException({ exception: error });
            throw error;
        }
    }

    updateTodo(id, updates) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            if (!todo) {
                client?.trackEvent({ 
                    name: "UpdateTodoFailed",
                    properties: { id, reason: "not_found" }
                });
                return null;
            }

            Object.assign(todo, updates);
            client?.trackEvent({ 
                name: "UpdateTodo",
                properties: { 
                    todoId: id,
                    newState: updates.state,
                    category: updates.category
                }
            });
            return todo;
        } catch (error) {
            client?.trackException({ exception: error });
            throw error;
        }
    }

    deleteTodo(id) {
        try {
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index === -1) {
                client?.trackEvent({ 
                    name: "DeleteTodoFailed",
                    properties: { id, reason: "not_found" }
                });
                return false;
            }
            
            this.todos.splice(index, 1);
            client?.trackEvent({ 
                name: "DeleteTodo",
                properties: { todoId: id }
            });
            return true;
        } catch (error) {
            client?.trackException({ exception: error });
            throw error;
        }
    }
}

export const todoService = new TodoService();