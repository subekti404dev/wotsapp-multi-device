
# Wotsapp
An Unofficial Whatsapp Multi Device API.

Run the development server:

```bash
# copy .env.example to .env and change some variables
# then run the app with this command
npm run dev
# or
yarn dev
```

Run production mode via docker 
```bash
docker run -d -p {YOUR_PORT}:3000 \
   -e APP_USERNAME={YOUR_USERNAME} \
   -e APP_PASSWORD={YOUR_PASSWORD} \
   -e APP_JWT_SECRET={YOUR_JWT_SECRET} \
   -e APP_STATIC_TOKEN={YOUR_API_STATIC_TOKEN} \
   --name wotsapp \
   subekti13/wotsapp-multi-device:latest

# change YOUR_PORT, YOUR_USERNAME, YOUR_PASSWORD, YOUR_JWT_SECRET, and YOUR_API_STATIC_TOKEN with your own.

# For example:
docker run -d -p 4000:3000 \
   -e APP_USERNAME=urip \
   -e APP_PASSWORD=ganteng \
   -e APP_JWT_SECRET=inijwtsecret \
   -e APP_STATIC_TOKEN=uRipgANtEnGBAngeT \
   --name wotsapp \
   subekti13/wotsapp-multi-device:latest


```

You can persist your data with create volume or bind your host folder to `/app/data` in the container.


Docker Image: https://hub.docker.com/r/subekti13/wotsapp-multi-device
