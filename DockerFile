FROM node:latest

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run init-db

CMD ["npm", "start"]