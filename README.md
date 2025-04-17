# todo-app
The classic To-Do application where a user can write down all the things he wants to accomplish. This project is written in javascript.

This project is composed by a frontend (React) and a backend (Node.js).

## Run the frontend
```bash
docker build -t todo-backend .
```

Or you can use the image from ghr.io

```bash
docker pull ghcr.io/marcelloraffaele/todo-app-js-backend:main
docker run -p 3000:3000 -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." ghcr.io/marcelloraffaele/todo-app-js-backend:main
```

## How to build and run the backend
```bash
# Build the image
docker build -t todo-frontend:local .
```
Or you can use the image from ghr.io


```bash
# Run the UI container
docker run -p 8080:80 -e BACKEND_URL="http://localhost:3000" -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." -e APP_NAME="todo-app-frontend" todo-frontend:main
```
