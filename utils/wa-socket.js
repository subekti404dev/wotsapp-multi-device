const { DisconnectReason, useSingleFileAuthState } = require('wa-multi-device');
const { getSessionPath } = require('./session');
const makeWASocket = require('wa-multi-device').default;
const P = require("pino");
const { updateStatus } = require('./db');
const sockets = {};
const fs = require('fs');
const isProd = process.env.NODE_ENV === 'production';

function waSocket(id, options = {}, forceRestart = false) {
    console.log(`[ Sockets ]`, Object.keys(sockets));
    console.log(`[ WA Socket ]`, JSON.stringify({ id, options, forceRestart }))
    if (sockets[id] && !forceRestart) {
        console.log('[ WA Socket ]', 'Get socket from global variable');
        return sockets[id];
    }
    const { state, saveState } = useSingleFileAuthState(getSessionPath(id));

    console.log('[ WA Socket ]', 'Create new socket');
    const sock = makeWASocket({
        logger: P({ level: isProd ? 'error' : 'trace', enabled: !(process.env.LOG_ENABLED === 'false') }),
        auth: state,
        ...options
    });
    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'close') {
            const statusCode = update?.lastDisconnect?.error?.output?.statusCode;
            if (![DisconnectReason.loggedOut, DisconnectReason.notJoinedBeta].includes(statusCode) && forceRestart) {
                console.log(`[ WA Socket ]`, "Restarting socket");
                return waSocket(id, options, true);
            }
            if (statusCode === DisconnectReason.loggedOut) {
                fs.unlinkSync(getSessionPath(id));
                delete sockets[id];
                console.log(`[ WA Socket ]`, 'Logged out');
            }
        }
    });
    sock.ev.on('creds.update', saveState);
    sock.ev.on('messages.update', (data = []) => {
        for (const d of data) {
            if (d.update?.status) {
                console.log('[ Status Update ]:', JSON.stringify(d));
                updateStatus(d.key?.id, d?.key.remoteJid, d.update?.status);
            }
        }
    });

    sockets[id] = sock;
    return sock;
}

module.exports = waSocket;