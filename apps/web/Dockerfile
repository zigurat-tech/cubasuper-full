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

RUN rm -r ./src

#start proyect
CMD ["yarn","start"]