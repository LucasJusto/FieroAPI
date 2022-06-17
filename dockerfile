FROM node:16.13.0-alpine3.11 AS base
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
EXPOSE 3030

#RUN apk update && apk add bash
#RUN wget https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh -O wait-for-it.sh && chmod +x wait-for-it.sh