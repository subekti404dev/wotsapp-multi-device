// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { initDB, webhook } = require("./utils/db");
const { getSessions } = require("./utils/session");
const waSocket = require("./utils/wa-socket");
const port = process.env.PORT || 3000;
const { event } = require('./utils/event');
const axios = require('axios').default;

const run = async () => {
   await initDB();
   // init sessions
   for (const session of getSessions()) {
      waSocket(session);
   }

   const dev = process.env.NODE_ENV !== 'production'
   const app = next({ dev })
   const handle = app.getRequestHandler()

   await app.prepare()
   createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      // const { pathname, query } = parsedUrl;

      handle(req, res, parsedUrl)

   }).listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`);

      event.on('message-upsert', async (data) => {
         const sessionId = data.sessionId;
         const webhooks = await webhook.getAllWebhooks();
         const webhooksToSend = webhooks.filter(w => w.is_active && w.session_id === sessionId);
         for (const webhook of webhooksToSend) {
            await axios.post(webhook.url, data);
         }
      });
   })
}

run();