const waSocket = require('./wa-socket');
const delay = require('delay');
const { message: { insertMessage, getMessageByID } } = require('./db');

const send = async (data, forceRestart = false, i = 1) => {
   const { sessionId, number, text, image_url } = data;
   console.log(`[ SEND ]`, JSON.stringify({ sessionId, number, text, forceRestart, i }))
   try {
      const sock = waSocket(sessionId, {}, forceRestart);
      let sentMsg = null;

      await delay(2000);
      const waId = `${number}@s.whatsapp.net`;
      const [checkResult] = await sock.onWhatsApp(waId);
      if (!checkResult?.exists) throw new Error(`${number} is not registered on Whatsapp`);
      let payload = { text };
      if (image_url) {
         payload = {
            caption: text,
            image: {
               url: image_url,
            }
         }
      }
      sentMsg = await sock.sendMessage(waId, payload);
      const id = await insertMessage({ ...sentMsg, sessionId, payload: data });
      const msg = getMessageByID(id);
      console.log(msg);
      return msg;
   } catch (error) {
      const errMsg = error?.message?.toLowerCase() || '';
      console.log(`[ SEND ERROR ]`, errMsg);
      if ((errMsg.includes('timeout') || errMsg.includes('websocket is not open') || errMsg.includes('timed out')) && i < 3) {
         console.log('[ SEND RETRY ]', `Retrying ${i}`);
         return send(data, true, i + 1);
      }
      throw error;
   }
}

module.exports = send;