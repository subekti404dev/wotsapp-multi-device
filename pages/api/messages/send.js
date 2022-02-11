import sendWA from "@/utils/send";
import { isSessionExist } from "@/utils/session";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
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