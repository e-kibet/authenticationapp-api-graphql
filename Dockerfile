FROM node:lts-alpine

RUN mkdir -p /usr/src/authenticationapp-api-graphql

WORKDIR /usr/src/authenticationapp-api-graphql

COPY .env .

COPY . .

RUN npm config set unsafe-perm true

RUN npm install pm2 -g

RUN pm2 list

RUN npm install
	
EXPOSE 9090

CMD ["pm2-runtime", "./ecosystem.config.js", "--env", "production", "--formatted"]

