FROM node:14
WORKDIR /usr/src/picture-gallery/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10088
CMD [ "node", "main.js" ]