FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

USER node

CMD ["npm", "start"]
