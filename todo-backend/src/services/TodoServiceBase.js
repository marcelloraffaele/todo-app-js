class TodoServiceBase {
    getAllTodos(userId) {
        throw new Error("Method 'getAllTodos()' must be implemented.");
    }

    getTodoById(userId, id) {
        throw new Error("Method 'getTodoById()' must be implemented.");
    }

    createTodo(userId, todoData) {
        throw new Error("Method 'createTodo()' must be implemented.");
    }

    updateTodo(userId, id, updates) {
        throw new Error("Method 'updateTodo()' must be implemented.");
    }

    deleteTodo(userId, id) {
        throw new Error("Method 'deleteTodo()' must be implemented.");
    }
}

module.exports = TodoServiceBase;
