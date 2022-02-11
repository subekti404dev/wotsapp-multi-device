import { message as dbMessage } from "@/utils/db";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   if (!(await useApiAuth(req, res))) return;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 20;
   const q = req.query.q || '';
   try {
      const messages = await dbMessage.getMessages(q, limit, page);
      res.json(messages);
   } catch (error) {
      res.status(500).json({ message: error.message, stack: error.stack });
   }
}