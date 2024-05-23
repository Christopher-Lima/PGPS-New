FROM node:22-alpine
WORKDIR /user/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:index"]