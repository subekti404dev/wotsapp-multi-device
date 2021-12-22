const waSocket = require('./wa-socket');
const delay = require('delay');

const getQR = async (sessionId) => {
    const sock = waSocket(sessionId, {}, true);
    let qr = null;
    sock.ev.on('connection.update', (update) => {
        if (update.qr) {
            qr = update.qr;
        }
    });
    await delay(3000);
    return qr
}

module.exports = getQR;