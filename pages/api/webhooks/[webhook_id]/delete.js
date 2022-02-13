import { webhook } from "@/utils/db";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
      const webhookId = req.query.webhook_id;
      await webhook.deleteWebhook(webhookId);
      res.json({ success: true, message: "Webhook deleted" });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
}