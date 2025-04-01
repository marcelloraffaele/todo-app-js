import { Todo, TodoState } from '../models/Todo.js';

class TodoService {
    constructor() {
        this.todos = [];
        this.currentId = 0;
    }

    getAllTodos() {
        return this.todos;
    }

    getTodoById(id) {
        return this.todos.find(todo => todo.id === id);
    }

    createTodo(todoData) {
        const todo = new Todo(todoData.description, todoData.category, todoData.expirationDate);
        todo.id = ++this.currentId;
        this.todos.push(todo);
        return todo;
    }

    updateTodo(id, todoData) {
        const todo = this.getTodoById(id);
        if (!todo) return null;

        if (todoData.description) todo.description = todoData.description;
        if (todoData.category) todo.category = todoData.category;
        if (todoData.expirationDate) todo.expirationDate = new Date(todoData.expirationDate);
        if (todoData.state && Object.values(TodoState).includes(todoData.state)) {
            todo.state = todoData.state;
        }

        return todo;
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) return false;
        
        this.todos.splice(index, 1);
        return true;
    }
}

export const todoService = new TodoService();