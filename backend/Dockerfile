FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

COPY apps ./apps

# Update Alpine packages to pick up security fixes before installing Node modules
RUN apk update && apk upgrade --no-cache

RUN npm install

CMD ["npm", "run", "start"]