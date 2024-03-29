FROM node:20-alpine

RUN apk add --no-cache sqlite
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install -g typescript
RUN npm install sharp --ignore-engines
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 4999
