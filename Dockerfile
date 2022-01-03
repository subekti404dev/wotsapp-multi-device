FROM alpine

RUN apk add --update nodejs yarn git

WORKDIR /wa

COPY package*.json ./
COPY . .
RUN yarn install --production && yarn cache clean

ENV NODE_ENV=production
ENV LOG_ENABLED=false


RUN yarn build
RUN yarn global add pm2

EXPOSE 3000
CMD [ "pm2-runtime", "ecosystem.config.js" ]
