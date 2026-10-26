# Build stage
FROM node:26-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

RUN apk add --no-cache jq

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx config for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Start nginx
#CMD ["nginx", "-g", "daemon off;"]
CMD ["/entrypoint.sh"]