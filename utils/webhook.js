// server.js

const { webhook } = require("./db");
const axios = require('axios').default;

const triggerWebhook = async (data) => {
    console.log('[Incoming Message]: ', JSON.stringify(data));
    const sessionId = data.sessionId;
    const webhooks = await webhook.getAllWebhooks();
    const webhooksToSend = webhooks.filter(w => w.is_active && w.session_id === sessionId);
    for (const webhook of webhooksToSend) {
        await axios.post(webhook.url, data);
    }
}

module.exports = { triggerWebhook };
