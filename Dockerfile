FROM node:lts-alpine
LABEL maintainer="FriendPost FrontEnd Team  <raj@rajware.net>"

WORKDIR /app
COPY . .
RUN npm ci

CMD [ "node", "app.js" ]

EXPOSE 8080