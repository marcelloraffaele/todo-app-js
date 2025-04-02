class TodoService {
    constructor() {
        this.todos = [];
        this.nextId = 1;
        this.appInsightsClient = null;
    }

    setAppInsightsClient(client) {
        this.appInsightsClient = client;
    }

    getAllTodos() {
        try {
            this.appInsightsClient?.trackEvent({ name: "GetAllTodos" });
            //this.appInsightsClient?.trackDependency({target:"http://dbname", name:"select todos", data:"SELECT * FROM Todos", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
            return this.todos;
        } catch (error) {
            this.appInsightsClient?.trackException({ exception: error });
            throw error;
        }
    }

    getTodoById(id) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            this.appInsightsClient?.trackEvent({ 
                name: "GetTodoById",
                properties: { id, found: !!todo }
            });
            //this.appInsightsClient?.trackDependency({target:"http://dbname", name:"select todos", data:"SELECT * FROM Todos where id=x", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
            return todo;
        } catch (error) {
            this.appInsightsClient?.trackException({ exception: error });
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
            this.appInsightsClient?.trackEvent({ 
                name: "CreateTodo",
                properties: { 
                    todoId: todo.id,
                    category: category || 'undefined'
                }
            });
            //this.appInsightsClient?.trackDependency({target:"http://dbname", name:"insert todo", data:"Insert into Todos....", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
            return todo;
        } catch (error) {
            this.appInsightsClient?.trackException({ exception: error });
            throw error;
        }
    }

    updateTodo(id, updates) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            if (!todo) {
                this.appInsightsClient?.trackEvent({ 
                    name: "UpdateTodoFailed",
                    properties: { id, reason: "not_found" }
                });
                return null;
            }

            Object.assign(todo, updates);
            this.appInsightsClient?.trackEvent({ 
                name: "UpdateTodo",
                properties: { 
                    todoId: id,
                    newState: updates.state,
                    category: updates.category
                }
            });
            //this.appInsightsClient?.trackDependency({target:"http://dbname", name:"update todos", data:"UPDATE Todos where...", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
            return todo;
        } catch (error) {
            this.appInsightsClient?.trackException({ exception: error });
            throw error;
        }
    }

    deleteTodo(id) {
        try {
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index === -1) {
                this.appInsightsClient?.trackEvent({ 
                    name: "DeleteTodoFailed",
                    properties: { id, reason: "not_found" }
                });
                return false;
            }
            
            this.todos.splice(index, 1);
            this.appInsightsClient?.trackEvent({ 
                name: "DeleteTodo",
                properties: { todoId: id }
            });
            //this.appInsightsClient?.trackDependency({target:"http://dbname", name:"delete todos", data:"DELETE Todos where ...", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
            return true;
        } catch (error) {
            this.appInsightsClient?.trackException({ exception: error });
            throw error;
        }
    }
}

const todoService = new TodoService();
export { todoService };
