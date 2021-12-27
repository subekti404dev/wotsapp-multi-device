import { getMessages } from "@/utils/db";

export default async function handler(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const q = req.query.q || '';
    try {
        const messages = await getMessages(q, limit, page);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}