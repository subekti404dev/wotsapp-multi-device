import { webhook } from "@/utils/db";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   try {
      if (!(await useApiAuth(req, res))) return;
      const webhookId = req.query.webhook_id;
      const body = req.body;
      await webhook.updateWebhook({...body, id: webhookId});
      res.json({ success: true, message: "Webhook updated" });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
}