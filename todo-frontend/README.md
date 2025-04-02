# Todo frontend

## How to run
```bash
npm run dev
```

### How to Docker build
```bash
# Build the image
docker build -t todo-frontend .

# Run the UI container
docker run -p 8080:80 -e BACKEND_URL="http://localhost:3000" -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." -e APP_NAME="todo-app-frontend" todo-frontend

# Run the API container
docker run -p 8080:8080 ghcr.io/marcelloraffaele/notes-api:latest
```

### Useful links
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind Flex Feature Showcase](https://tailwindflex.com/@alok/feature-showcase)