# todo-app
The classic To-Do application where a user can write down all the things he wants to accomplish. This project is written in javascript.

This project is composed by a frontend (React) and a backend (Node.js).

## Dependencies and security

Use Node.js 24 LTS (also supported: Node.js 22.13+ within 22.x). CI and Docker builds use
Node.js 24. Install reproducibly with `npm ci` in each application directory;
commit both package manifests and lockfiles when updating dependencies.
Dependabot checks npm packages, Docker base images, and GitHub Actions weekly.
Workflow actions are pinned to immutable commits, and package-publishing
permissions are restricted to publishing jobs.

After an update, run:

```powershell
npm test --prefix todo-backend -- --runInBand
npm run lint --prefix todo-frontend
npm run build --prefix todo-frontend
npm audit --prefix todo-backend
npm audit --prefix todo-frontend
```

The October 2026 update reduced the backend audit from 48 to 8 advisories
(4 high, 4 moderate; no critical) and the frontend from 20 to zero. The backend
count includes dependent packages, not eight independent vulnerabilities:

| Dependency chain | Remaining risk / mitigation |
| --- | --- |
| Express / body-parser | Compressed-body denial of service. The API rejects compressed JSON with HTTP 415 (`inflate: false`) and limits JSON to 100 KiB. A compatible upstream fix is not yet published. |
| Azure Monitor / Azure Identity / MSAL Node | Authorization-code parameter disclosure in transitive MSAL 6. This app does not implement an authorization-code flow; do not add one using the affected dependency. Await an Azure Identity release that supports patched MSAL 7.1+. |
| swagger-jsdoc / swagger-parser / AJV / fast-uri | URI parsing and normalization advisories in fast-uri 3. Only repository-owned Swagger annotations are processed; do not process untrusted specifications. The patched fast-uri 4 is outside the upstream dependency range. |

No incompatible transitive overrides or forced audit downgrades are applied.
Backend CI currently blocks critical advisories while reporting all remaining
advisories; frontend CI blocks high and critical advisories. Raise the backend
gate to `--audit-level=high` once compatible upstream fixes are available.

Security hardening:

- API responses use Helmet security headers. Todo updates allow only
  `description`, `category`, `expirationDate`, and `state`; client-supplied
  identity, metadata, and prototype keys are ignored.
- Set backend `CORS_ORIGINS` to a comma-separated list of exact frontend origins,
  for example `http://localhost:8080,https://todo.example.com`. If unset, wildcard
  CORS is retained for demo compatibility. CORS is not authentication.
- Nginx adds a Content Security Policy, anti-framing and MIME-sniffing headers,
  and prevents runtime configuration caching. Runtime environment values are
  JSON-escaped using jq rather than interpolated into executable JavaScript.
  The CSP permits HTTP/HTTPS API and telemetry connections to preserve dynamic
  `BACKEND_URL` support; restrict `connect-src` to deployment-specific origins
  where possible.
- Environment files are excluded from source control and Docker build contexts.
  Browser configuration is public: never put passwords or private keys in it.
- Frontend telemetry does not capture request or response headers, reducing the
  risk of sending identity or other sensitive headers to Application Insights.
- TLS termination and HSTS must be configured at your HTTPS ingress. They are
  intentionally not forced by the application so local HTTP development works.

**Production authentication is still required.** The `user_id` header is an
unverified caller-supplied identity, not an authentication mechanism. Do not
expose this demo to untrusted users until a trusted authentication layer derives
the identity and overwrites that header. Rate limiting and production access
controls should also be enforced at the ingress.

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
docker run -p 3000:3000 -e APPINSIGHTS_CONNECTION_STRING="InstrumentationKey=..." ghcr.io/marcelloraffaele/todo-app-js-backend:main
```

## Using Docker Compose

You can run both the frontend and backend services together using Docker Compose:

```bash
docker-compose up
```

This will start both services with the correct configuration and environment variables. The frontend will be available at http://localhost:8080 and the backend at http://localhost:8081.

To run in detached mode:

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```

## Environment Variables

Both the frontend and backend applications use environment variables for configuration. These variables allow you to customize settings like connection strings, ports, and service names without modifying the code. They are typically passed to the Docker containers during the `docker run` command using the `-e` flag or defined in a `.env` file for local development (like the one provided for the backend).

| Variable                             | Component | Description                                                                 | Example Value                                                                                              |
| :----------------------------------- | :-------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `APPINSIGHTS_CONNECTION_STRING` | Backend   | Connection string for Azure Application Insights telemetry.                 | `InstrumentationKey=...;IngestionEndpoint=...`                                                             |
| `PORT`                               | Backend   | The port number the backend server will listen on.                          | `3000`                                                                                                     |
| `SERVICE_NAME`                       | Backend   | A name to identify this service instance, potentially used in logging/tracing. | `todo-backend-local`                                                                                       |
| `DB_TYPE`                            | Backend   | Specifies the database type to use (`local` or `cosmosdb`). Commented out.  | `local`                                                                                                    |
| `COSMOS_ENDPOINT`                    | Backend   | The endpoint URL for the Azure Cosmos DB instance. Commented out.           | `https://<your-cosmos-db-account>.documents.azure.com:443/`                                                |
| `COSMOS_KEY`                         | Backend   | The primary key for accessing the Azure Cosmos DB instance. Commented out.  | `<your-cosmos-db-key>`                                                                                     |
| `BACKEND_URL`                        | Frontend  | The URL where the frontend can reach the backend API.                       | `http://localhost:3000`                                                                                    |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Frontend  | Connection string for Azure Application Insights telemetry (for frontend).    | `InstrumentationKey=...`                                                                                   |
| `APP_NAME`                           | Frontend  | A name to identify the frontend application instance.                       | `todo-app-frontend`                                                                                        |
| `OTEL_SERVICE_NAME`                     | Backend   | The service name used for OpenTelemetry tracing.                             | `todo-backend-local`
