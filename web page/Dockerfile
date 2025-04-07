FROM node:22.10-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm install esbuild@0.25.1
RUN npm run build

EXPOSE 8090

CMD [ "serve", "-s", "dist" ]