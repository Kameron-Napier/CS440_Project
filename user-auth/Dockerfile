# user-auth/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3

COPY package*.json ./
RUN npm install --production

# Cleanup build dependencies
RUN apk del make gcc g++ python3

COPY . .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["node", "auth-server.js"]