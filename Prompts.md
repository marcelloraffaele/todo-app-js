## Demo

### Prompt 1
```
create a nodejs application into the folder `todo-backend` that expose API for a TODO application.
The `Todo` should contain the following fields: id, Description, creationDate, expirationDate, category, state[done, active, canceled]
In order to manage the Id, create a counter for the max Id.
The REST API should have the following methods:
- GET /todos : get all todo from service
- POST /todos: add a new todo
- GET /todos/<id> : get the todo with the id
- PUT /todos/<id>: modify the todo
- DELETE /todos/<id>: delete the todo
Generate swagger dependency classes in order to get the documentation of this API.
```

### Prompt2
```
create the client.http file with a client for testing this api
```

### Prompt 3
```
create a dockerfile for this application
```

### Prompt 3.1
Test the image
```
docker build -t todo-app .
docker run -p 3000:3000 -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=example-key;IngestionEndpoint=https://example.endpoint" todo-app
```
or
```
docker pull ghcr.io/marcelloraffaele/todo-app-js-backend:main
docker run -p 3000:3000 -e APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=example-key;IngestionEndpoint=https://example.endpoint" ghcr.io/marcelloraffaele/todo-app-js-backend:main
```

### Prompt 3.2
```
create a file `ci-backend.yml` with a github action for js build and docker build and push in github image repository
```

### Prompt 3.3
```
add app insight instrumentation for this application. get the necessary config from env var, be sure it will work from a container. Be sure instrument all traces and logs.
```

### Prompt 4
Follow the instructions below:
1. Extract the swagger definition and save it in a file `api-definition.json`.
2. Using **GiHub Copilot Agent Mode**, select the **Claude 3.7** model and add as attachment the file `api-definition.json`, add the `frontend` folder and call the agent with the following prompt:
```
Create a react application in the folder `todo-frontend` that manages todos using that API.
The graphical aspect must be colored and must use Tailwind.
Split the implementation into components and put the REST client in a folder named `services`.
Tailwind is already configured, don't configure it.
```