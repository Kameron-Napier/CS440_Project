# api-gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install --production


COPY . .


ENV NODE_ENV=production
ENV PORT=3000


EXPOSE 3000
CMD ["node", "gateway-server.js"]