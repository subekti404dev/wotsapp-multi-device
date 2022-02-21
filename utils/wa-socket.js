const { DisconnectReason, useSingleFileAuthState, downloadContentFromMessage } = require('wa-multi-device');
const { getSessionPath } = require('./session');
const makeWASocket = require('wa-multi-device').default;
const P = require("pino");
const { message: { updateStatus } } = require('./db');
const sockets = {};
const fs = require('fs');
const { writeFile } = require('fs/promises');
const isProd = process.env.NODE_ENV === 'production';
const path = require('path');
const mime = require('mime-types');
const { event } = require('./event');
const { triggerWebhook } = require('./webhook');

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
      keepAliveIntervalMs: 3 * 1000, // 3 seconds
      ...options
   });
   sockets[id] = sock;

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

   sock.ev.on('messages.upsert', async ({ messages }) => {
      console.log('[ Upsert ]:', JSON.stringify(messages));
      const m = messages[0];
      if (m && m.message && m.key?.fromMe === false) {
         const messageType = Object.keys(m.message)[0];
         if (messageType === 'extendedTextMessage') {
            const result = {
               key: m?.key,
               message: {
                  text: m?.message?.extendedTextMessage?.text
               },
               messageTimestamp: m?.messageTimestamp?.low,
               pushName: m?.pushName,
               sessionId: id
            }
            triggerWebhook(result);
         }

         if (m.message.conversation) {
            const result = {
               key: m?.key,
               message: {
                  text: m?.message?.conversation
               },
               messageTimestamp: m?.messageTimestamp?.low,
               pushName: m?.pushName,
               sessionId: id
            }
            triggerWebhook(result);
         }
         //   if image
         if (messageType === 'imageMessage') {
            const stream = await downloadContentFromMessage(m.message.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk]);
            }
            // const filePath = path.join('public', 'tmp', m.key.id + '.' + mime.extension(m.message.imageMessage.mimetype));
            // await writeFile(filePath, buffer);
            // const result = { ...m, sessionId: id, filePath: `/${filePath}` };
            // console.log('[ Message Upsert ]:', result);
         }
      }
   });

   return sock;
}

module.exports = waSocket;
