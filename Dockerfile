FROM node:lts AS development
ENV CI=false
# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY .env ./.env
RUN npm ci
COPY . ./

CMD [ "npm", "start" ]

FROM development AS builder

RUN npm run build

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF
# Make port 3000 available to the world outside this container
EXPOSE 3000

# start app
CMD ["npm", "start"]

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html