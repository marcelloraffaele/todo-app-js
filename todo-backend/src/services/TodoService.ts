import { Todo, TodoInput } from '../models/Todo.js';

export class TodoService {
    private todos: Todo[] = [];
    private nextId: number = 1;

    getAllTodos(): Todo[] {
        try {
            return this.todos;
        } catch (error) {
            throw error;
        }
    }

    getTodoById(id: number): Todo | undefined {
        try {
            return this.todos.find(todo => todo.id === id);
        } catch (error) {
            throw error;
        }
    }

    createTodo(data: TodoInput): Todo {
        try {
            const todo: Todo = {
                id: this.nextId++,
                description: data.description,
                category: data.category,
                creationDate: new Date(),
                expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
                state: 'active'
            };
            this.todos.push(todo);
            return todo;
        } catch (error) {
            throw error;
        }
    }

    updateTodo(id: number, updates: Partial<Todo>): Todo | null {
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

    deleteTodo(id: number): boolean {
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

export const todoService = new TodoService();