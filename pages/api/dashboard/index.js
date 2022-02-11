import { message as dbMessage } from "@/utils/db";
import { getSessions } from "@/utils/session";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   if (!(await useApiAuth(req, res))) return;
   const uptime = process.uptime();
   const totalMessage = await dbMessage.getMessageCount();
   const sessions = await getSessions();
   res.json({ uptime, totalMessage, activeSessions: sessions.length });
}