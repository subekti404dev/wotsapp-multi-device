FROM alpine as builder

RUN apk add --update nodejs yarn git

WORKDIR /wa

COPY package*.json ./
COPY . .

RUN yarn install --production && yarn cache clean





FROM alpine
WORKDIR /wa

ENV NODE_ENV=production
ENV LOG_ENABLED=false

RUN yarn global add pm2

COPY --from=builder /wa/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD [ "pm2-runtime", "ecosystem.config.js" ]
