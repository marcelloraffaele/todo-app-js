# todo-app
The classic To-Do application where a user can write down all the things he wants to accomplish. This project is written in javascript.

This project is composed by a frontend (React) and a backend (Node.js).

## Run the frontend
```bash
docker build -t todo-frontend:local .
```

Or you can use the image from ghr.io

```bash
docker pull ghcr.io/marcelloraffaele/todo-app-js-frontend:main
docker run -p 8080:80 -e BACKEND_URL="http://localhost:3000" -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." -e APP_NAME="todo-app-frontend" ghcr.io/marcelloraffaele/todo-app-js-frontend:main
```

## How to build and run the backend
```bash
# Build the image
docker build -t todo-backend .
```
Or you can use the image from ghr.io

```bash
docker pull ghcr.io/marcelloraffaele/todo-app-js-backend:main
docker run -p 3000:3000 -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." ghcr.io/marcelloraffaele/todo-app-js-backend:main
```

## Environment Variables

Both the frontend and backend applications use environment variables for configuration. These variables allow you to customize settings like connection strings, ports, and service names without modifying the code. They are typically passed to the Docker containers during the `docker run` command using the `-e` flag or defined in a `.env` file for local development (like the one provided for the backend).

| Variable                             | Component | Description                                                                 | Example Value                                                                                              |
| :----------------------------------- | :-------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Backend   | Connection string for Azure Application Insights telemetry.                 | `InstrumentationKey=...;IngestionEndpoint=...`                                                             |
| `PORT`                               | Backend   | The port number the backend server will listen on.                          | `3000`                                                                                                     |
| `SERVICE_NAME`                       | Backend   | A name to identify this service instance, potentially used in logging/tracing. | `todo-backend-local`                                                                                       |
| `DB_TYPE`                            | Backend   | Specifies the database type to use (`local` or `cosmosdb`). Commented out.  | `local`                                                                                                    |
| `COSMOS_ENDPOINT`                    | Backend   | The endpoint URL for the Azure Cosmos DB instance. Commented out.           | `https://<your-cosmos-db-account>.documents.azure.com:443/`                                                |
| `COSMOS_KEY`                         | Backend   | The primary key for accessing the Azure Cosmos DB instance. Commented out.  | `<your-cosmos-db-key>`                                                                                     |
| `BACKEND_URL`                        | Frontend  | The URL where the frontend can reach the backend API.                       | `http://localhost:3000`                                                                                    |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Frontend  | Connection string for Azure Application Insights telemetry (for frontend).    | `InstrumentationKey=...`                                                                                   |
| `APP_NAME`                           | Frontend  | A name to identify the frontend application instance.                       | `todo-app-frontend`                                                                                        |
