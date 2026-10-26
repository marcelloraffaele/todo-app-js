# Todo-backend

## Run the backend

```bash
npm run dev
```

## Run with Docker

From the repository root:

```bash
docker build -t todo-backend ./todo-backend
docker run --rm -p 3000:3000 -e DB_TYPE=local todo-backend
```

The image uses a single stage because the backend runs JavaScript directly,
without a compilation step. It installs only locked production dependencies
with `npm ci --omit=dev` and removes the npm cache in the same layer.
Only the package manifests and application source are copied; tests and
environment files are excluded. The application runs as the non-root `node`
user with `NODE_ENV=production`, and Node starts directly to receive container
termination signals.

Supply configuration at runtime using `-e` or `--env-file`; do not bake secrets
into the image. The default container port is 3000. If you set `PORT`, update
the container side of the port mapping accordingly.
