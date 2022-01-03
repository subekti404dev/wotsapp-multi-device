FROM alpine as builder

RUN apk add --update nodejs yarn git

WORKDIR /wa

COPY package*.json ./
COPY . .

RUN yarn install --production && yarn cache clean





FROM node:alpine
WORKDIR /wa

ENV NODE_ENV=production
ENV LOG_ENABLED=false


COPY --from=builder /wa/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]
