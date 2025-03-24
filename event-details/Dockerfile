# event-details/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=3003

EXPOSE 3003
CMD ["node", "details-server.js"]