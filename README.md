
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
   -e NEXTAUTH_URL={YOUR_BASE_URL} \
   -e USERNAME={YOUR_USERNAME} \
   -e PASSWORD={YOUR_PASSWORD} \
   -e API_TOKEN={YOUR_API_TOKEN} \
   subekti13/wotsapp-multi-device:latest

# change YOUR_PORT, YOUR_BASE_URL, YOUR_USERNAME, YOUR_PASSWORD, and YOUR_API_TOKEN with your own.

# For example:
docker run -d -p 4000:3000 \
   -e NEXTAUTH_URL=http://localhost:4000 \
   -e USERNAME=urip \
   -e PASSWORD=ganteng \
   -e API_TOKEN=uRipgANtEnGBAngeT \
   subekti13/wotsapp-multi-device:latest


```
