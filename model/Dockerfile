FROM node:20.19.5

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

COPY . .
RUN npm run env && npm run build

EXPOSE 49543

CMD ["npm", "start"]
