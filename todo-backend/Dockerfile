FROM node:26-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY src/ ./src/

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]