export interface Todo {
    id?: number;
    description: string;
    creationDate?: string;
    expirationDate?: string;
    category?: string;
    state?: 'done' | 'active' | 'canceled';
}

const API_URL = 'http://localhost:3000'; // Adjust this based on your backend URL

export class TodoService {
    async getAllTodos(): Promise<Todo[]> {
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        return response.json();
    }

    async createTodo(todo: Omit<Todo, 'id' | 'creationDate'>): Promise<Todo> {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Failed to create todo');
        }
        return response.json();
    }

    async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Failed to update todo');
        }
        return response.json();
    }

    async deleteTodo(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
    }
}