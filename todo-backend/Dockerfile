# Use Node.js 22 as the base image
FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application from the built JavaScript
CMD [ "npm", "start" ]