export type TodoState = 'done' | 'active' | 'canceled';

export interface TodoInput {
    description: string;
    category?: string;
    expirationDate?: string;
}

export interface Todo {
    id: number;
    description: string;
    category?: string;
    creationDate: Date;
    expirationDate?: Date;
    state: TodoState;
}