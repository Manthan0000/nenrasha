# base
FROM node:20-alpine AS base
WORKDIR /app

# installer 
FROM base AS installer 
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# builder
FROM installer AS builder
COPY . .
RUN npm run build

# runner 
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
