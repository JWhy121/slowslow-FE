# 1. build stage
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

# 2. run stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html