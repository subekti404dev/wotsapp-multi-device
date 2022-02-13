import { webhook } from "@/utils/db";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
      const body = req.body;
      await webhook.insertWebhook(body);
      res.json({ success: true, message: "Webhook created" });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
}