# pull official base image
FROM node:13.12.0-alpine

# Declaring env
ENV NODE_ENV development

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY .env ./.env
RUN npm install --silent

COPY . ./

# Make port 3000 available to the world outside this container
EXPOSE 3000

# start app
CMD ["npm", "start"]