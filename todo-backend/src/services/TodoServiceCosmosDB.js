const TodoServiceBase = require('./TodoServiceBase');
const { CosmosClient } = require("@azure/cosmos");

// Read Cosmos DB configuration from environment variables
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE_ID || "TODOs";
const containerId = process.env.COSMOS_CONTAINER_ID || "Items";

if (!endpoint || !key) {
    console.warn('Cosmos DB environment variables (COSMOS_ENDPOINT, COSMOS_KEY) are not set. TodoServiceCosmosDB will not function.');
}

class TodoServiceCosmosDB extends TodoServiceBase {
    constructor() {
        super();
        if (!endpoint || !key) {
            throw new Error("Cosmos DB configuration is missing.");
        }
        this.client = new CosmosClient({ endpoint, key });
        this.database = this.client.database(databaseId);
        this.container = this.database.container(containerId);
        this._initializeDatabase();
    }

    async _initializeDatabase() {
        try {
            await this.client.databases.createIfNotExists({ id: databaseId });
            await this.database.containers.createIfNotExists({ id: containerId, partitionKey: { paths: ["/userId"] } });
            console.log(`Database '${databaseId}' and container '${containerId}' ensured.`);
        } catch (error) {
            console.error("Error initializing Cosmos DB database/container:", error);
            // Decide if the app should proceed or throw
            throw new Error("Failed to initialize Cosmos DB.");
        }
    }

    // Helper to create a unique ID (Cosmos DB uses 'id')
    _generateId() {
        return require('crypto').randomUUID();
    }

    async getAllTodos(userId) {
        try {
            const querySpec = {
                query: "SELECT * FROM c WHERE c.userId = @userId",
                parameters: [
                    { name: "@userId", value: userId }
                ]
            };
            const { resources: items } = await this.container.items.query(querySpec).fetchAll();
            return items;
        } catch (error) {
            console.error(`Error getting all todos for user ${userId} from Cosmos DB:`, error);
            throw new Error('Failed to retrieve todos from Cosmos DB.');
        }
    }

    async getTodoById(userId, id) {
        try {
            // In Cosmos DB, the item's ID and partition key are needed for efficient point reads.
            const { resource: item } = await this.container.item(id, userId).read();
            return item; // Returns undefined if not found
        } catch (error) {
            if (error.code === 404) {
                return undefined; // Consistent with find behavior
            }
            console.error(`Error getting todo by id ${id} for user ${userId} from Cosmos DB:`, error);
            throw new Error('Failed to retrieve todo from Cosmos DB.');
        }
    }

    async createTodo(userId, { description, category, expirationDate }) {
        try {
            const newTodo = {
                id: this._generateId(), // Cosmos DB requires a string 'id'
                userId, // Include userId for partitioning
                description,
                category,
                creationDate: new Date().toISOString(),
                expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null,
                state: 'active'
            };
            const { resource: createdItem } = await this.container.items.create(newTodo);
            return createdItem;
        } catch (error) {
            console.error(`Error creating todo for user ${userId} in Cosmos DB:`, error);
            throw new Error('Failed to create todo in Cosmos DB.');
        }
    }

    async updateTodo(userId, id, updates) {
        try {
            // Fetch the item first to apply updates (or use Patch)
            const { resource: item } = await this.container.item(id, userId).read();
            if (!item) {
                return null; // Not found
            }

            // Ensure userId, id, and creationDate are not overwritten
            const safeUpdates = { ...updates };
            delete safeUpdates.id;
            delete safeUpdates.userId; // Partition key shouldn't change
            delete safeUpdates.creationDate;

            // Merge updates
            const updatedItem = { ...item, ...safeUpdates };

            const { resource: replacedItem } = await this.container.item(id, userId).replace(updatedItem);
            return replacedItem;
        } catch (error) {
            if (error.code === 404) {
                return null; // Not found
            }
            console.error(`Error updating todo id ${id} for user ${userId} in Cosmos DB:`, error);
            throw new Error('Failed to update todo in Cosmos DB.');
        }
    }

    async deleteTodo(userId, id) {
        try {
            await this.container.item(id, userId).delete();
            return true; // Indicate successful deletion
        } catch (error) {
            if (error.code === 404) {
                return false; // Indicate not found/not deleted
            }
            console.error(`Error deleting todo id ${id} for user ${userId} in Cosmos DB:`, error);
            throw new Error('Failed to delete todo from Cosmos DB.');
        }
    }
}

module.exports = TodoServiceCosmosDB;
