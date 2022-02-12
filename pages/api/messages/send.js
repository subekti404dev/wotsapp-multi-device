import sendWA from "@/utils/send";
import { isSessionExist } from "@/utils/session";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
      const sessionId = req.body.sessionId;
      if (!isSessionExist(sessionId)) {
         throw new Error(`Device ${sessionId} doesn't exists`);
      }
      const result = await sendWA(req.body);
      res.json(result);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}