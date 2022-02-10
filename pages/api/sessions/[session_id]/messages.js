import { message as dbMessage } from "@/utils/db";

export default async function handler(req, res) {
    const sessionId = req.query.session_id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const q = req.query.q || '';
    try {
        const messages = await dbMessage.getMessagesBySessionId(sessionId, q, limit, page);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}