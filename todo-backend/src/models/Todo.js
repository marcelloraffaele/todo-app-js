export class Todo {
    constructor(description, category, expirationDate) {
        this.id = null;  // Will be set by the service
        this.description = description;
        this.creationDate = new Date();
        this.expirationDate = expirationDate ? new Date(expirationDate) : null;
        this.category = category;
        this.state = 'active';  // Default state is active
    }
}

export const TodoState = {
    DONE: 'done',
    ACTIVE: 'active',
    CANCELED: 'canceled'
};