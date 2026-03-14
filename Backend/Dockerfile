# base image 
FROM node:20-alpine AS base
WORKDIR /app

# installation 
FROM base AS installer 
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

# build phase
FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY . .

# run phase 
FROM node:20-alpine AS runner 
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5000

CMD ["node","src/server.js"]