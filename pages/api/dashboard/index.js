import { message as dbMessage } from "@/utils/db";
import { getSessions } from "@/utils/session";


export default async function handler(req, res) {
    const uptime = process.uptime();
    const totalMessage = await dbMessage.getMessageCount();
    const sessions = await getSessions();
    res.json({ uptime, totalMessage, activeSessions: sessions.length });
}