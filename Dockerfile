FROM node:16.14-alpine3.15 as build

RUN apk add git
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production
COPY . ./
RUN yarn build



FROM node:16.14-alpine3.15

WORKDIR /app
COPY --from=build /app ./
RUN ls -la
ENV NODE_ENV=production
ENV LOG_ENABLED=false
ENV NEXT_PUBLIC_ENABLE_WEBHOOK=false

EXPOSE 3000
CMD [ "node", "server.js" ]
