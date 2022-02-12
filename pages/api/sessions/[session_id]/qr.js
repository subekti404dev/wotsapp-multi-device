import getQR from "@/utils/get-qr";
import { isSessionExist } from "@/utils/session";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
      const sessionId = req.query.session_id;
      if (isSessionExist(sessionId)) {
         throw new Error(`Device ${sessionId} already exists`);
      }
      const qr = await getQR(sessionId);
      res.json({ qr });
   } catch (error) {
      res.status(500).json({ message: error.message, stack: error.stack });
   }
}