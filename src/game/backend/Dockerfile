FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

RUN chown -R node:node /usr/src/app

COPY . .

USER node

RUN npm run build

CMD ["npm", "start"]
