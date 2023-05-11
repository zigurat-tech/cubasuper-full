FROM node:latest

WORKDIR app

#copy files for installation
COPY package.json .
COPY yarn.lock .

#install dependencies
RUN yarn install

COPY . .

#build proyect
RUN yarn build

EXPOSE 3000

#start proyect
CMD ["yarn","start"]