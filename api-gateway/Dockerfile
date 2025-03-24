# api-gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose and run
EXPOSE 3000
CMD ["node", "gateway-server.js"]