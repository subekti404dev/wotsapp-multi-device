// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { createTables } = require("./utils/db");
const { getSessions } = require("./utils/session");
const waSocket = require("./utils/wa-socket");
const port = process.env.PORT || 3000;

createTables();
// init sessions
for (const session of getSessions()) {
    waSocket(session);
}

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        handle(req, res, parsedUrl)

    }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})