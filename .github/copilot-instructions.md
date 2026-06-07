# GitHub Copilot Instructions

## Project Overview

This is a **full-stack Todo application** written in JavaScript/TypeScript. It follows a classic client-server architecture with Docker support for containerized deployments.

## Architecture

```
todo-app-js/
├── todo-backend/   # Node.js + Express REST API (CommonJS)
└── todo-frontend/  # React + TypeScript + Vite SPA (ESM)
```

### Backend (`todo-backend/`)
- **Runtime**: Node.js, Express 5
- **Module system**: CommonJS (`require`/`module.exports`)
- **Entry point**: `src/index.js`
- **API docs**: Swagger UI at `/api-docs`, JSON spec at `/api-docs.json`
- **Testing**: Jest + Supertest (`npm test`)
- **Dev server**: `npm run dev` (uses `node --watch`)

### Frontend (`todo-frontend/`)
- **Framework**: React 19 + TypeScript
- **Module system**: ESM (`import`/`export`)
- **Build tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Dev server**: `npm run dev` (Vite)

## Key Patterns

### Todo Model
Every todo has these fields:
```js
{
  id,           // set by the service
  description,  // required string
  creationDate, // Date, set on creation
  expirationDate, // optional Date
  category,     // optional string
  state         // 'active' | 'done' | 'canceled'
}
```

### Backend Service Pattern
All backend data access goes through `TodoServiceBase` (abstract-like class). 

The active implementation is selected at startup by `todoServiceFactory.js` based on the `DB_TYPE` env var:
- `DB_TYPE=cosmosdb` → `TodoServiceCosmosDB`
- anything else → `TodoServiceLocal` (in-memory Map)

### Authentication / User Identity
Every `/todos` request **must** include a `user_id` HTTP header. The `requireUserId` middleware reads it from `req.headers['user_id']` and attaches it to `req.userId`. All service methods receive `userId` as their first argument.

### Frontend API calls
The frontend reads `window._env_?.BACKEND_URL` (injected at runtime via `public/config.js`) and falls back to `http://localhost:3000`. All API calls go through `src/services/TodoService.tsx`.

### Observability
Both apps integrate **Azure Application Insights** via OpenTelemetry (`@azure/monitor-opentelemetry`). The backend initializes tracing in `src/util/app-insights.js` before anything else. Connection string is read from `APPINSIGHTS_CONNECTION_STRING` (backend) / `APPLICATIONINSIGHTS_CONNECTION_STRING` (frontend).

## Environment Variables

| Variable | Component | Purpose |
|---|---|---|
| `PORT` | Backend | Server port (default 3000) |
| `SERVICE_NAME` | Backend | Service name for tracing |
| `DB_TYPE` | Backend | `local` (default) or `cosmosdb` |
| `COSMOS_ENDPOINT` | Backend | Azure Cosmos DB endpoint |
| `COSMOS_KEY` | Backend | Azure Cosmos DB key |
| `APPINSIGHTS_CONNECTION_STRING` | Backend | Azure Monitor connection string |
| `BACKEND_URL` | Frontend | URL of the backend API |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Frontend | Azure Monitor connection string |
| `APP_NAME` | Frontend | Frontend app name for tracing |

## Running Locally

```bash
# Backend only
cd todo-backend && npm run dev

# Frontend only
cd todo-frontend && npm run dev
```

## Coding Conventions

- **Backend**: CommonJS modules, async/await, JSDoc Swagger annotations on every route
- **Frontend**: TypeScript strict mode, functional React components, hooks only (no class components)
- **Error handling**: All Express route handlers are `async` and wrapped in `try/catch`; errors return `{ message: '...' }` JSON with appropriate HTTP status codes
- **New routes**: Must include JSDoc `@swagger` annotations following the existing style in `src/index.js`
