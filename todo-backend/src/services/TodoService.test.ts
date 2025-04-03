import { todoService } from './TodoService.js';
import { Todo, TodoInput, TodoState } from '../models/Todo.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('TodoService', () => {
    beforeEach(() => {
        // Reset the service before each test
        (todoService as any).todos = [];
        (todoService as any).nextId = 1;
    });

    describe('createTodo', () => {
        it('should create a new todo with correct properties', () => {
            const todoData: TodoInput = {
                description: 'Test todo',
                category: 'test',
                expirationDate: '2025-12-31T23:59:59.999Z'
            };

            const todo = todoService.createTodo(todoData);

            expect(todo.id).toBe(1);
            expect(todo.description).toBe(todoData.description);
            expect(todo.category).toBe(todoData.category);
            expect(todo.expirationDate).toEqual(new Date(todoData.expirationDate!));
            expect(todo.state).toBe('active');
        });
    });

    describe('getTodoById', () => {
        it('should return the correct todo by id', () => {
            const todo = todoService.createTodo({ description: 'Test todo' });
            const found = todoService.getTodoById(todo.id);
            expect(found).toEqual(todo);
        });

        it('should return undefined for non-existent todo', () => {
            const found = todoService.getTodoById(999);
            expect(found).toBeUndefined();
        });
    });

    describe('updateTodo', () => {
        it('should update todo properties correctly', () => {
            const todo = todoService.createTodo({ description: 'Original' });
            const updates: Partial<Todo> = {
                description: 'Updated',
                category: 'test',
                state: 'done' as TodoState
            };

            const updated = todoService.updateTodo(todo.id, updates);

            expect(updated?.description).toBe(updates.description);
            expect(updated?.category).toBe(updates.category);
            expect(updated?.state).toBe(updates.state);
        });

        it('should return null for non-existent todo', () => {
            const result = todoService.updateTodo(999, { description: 'Test' });
            expect(result).toBeNull();
        });
    });

    describe('deleteTodo', () => {
        it('should delete existing todo', () => {
            const todo = todoService.createTodo({ description: 'To be deleted' });
            const result = todoService.deleteTodo(todo.id);
            expect(result).toBe(true);
            expect(todoService.getTodoById(todo.id)).toBeUndefined();
        });

        it('should return false for non-existent todo', () => {
            const result = todoService.deleteTodo(999);
            expect(result).toBe(false);
        });
    });
});