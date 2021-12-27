import sendWA from "@/utils/send";
import { isSessionExist } from "@/utils/session";

export default async function handler(req, res) {
    try {
        const sessionId = req.body.sessionId;
        const number = req.body.number;
        const text = req.body.text;
        if (!isSessionExist(sessionId)) {
            throw new Error(`Device ${sessionId} doesn't exists`);
        }
        const result = await sendWA(sessionId, number, text);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}