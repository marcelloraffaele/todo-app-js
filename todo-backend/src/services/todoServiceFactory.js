// filepath: c:\Workspaces\Code\todo-app-js\todo-backend\src\services\todoServiceFactory.js
const TodoServiceLocal = require('./TodoServiceLocal');
const TodoServiceCosmosDB = require('./TodoServiceCosmosDB');

const dbType = process.env.DB_TYPE?.toLowerCase(); // Use optional chaining and convert to lower case

let todoServiceInstance;

if (dbType === 'cosmosdb') {
    console.log("Using Cosmos DB for TodoService.");
    try {
        // Cosmos DB service might throw if config is missing
        todoServiceInstance = new TodoServiceCosmosDB();
    } catch (error) {
        console.error("Failed to initialize TodoServiceCosmosDB:", error.message);
        console.log("Falling back to local storage.");
        todoServiceInstance = null;
    }
} else {
    console.log("Using local Map storage for TodoService (DB_TYPE environment variable not set to 'cosmosdb').");
    todoServiceInstance = new TodoServiceLocal();
}

// Export the chosen instance
module.exports = {
    todoService: todoServiceInstance
};
