# event-scheduling/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002
CMD ["node", "scheduling-server.js"]