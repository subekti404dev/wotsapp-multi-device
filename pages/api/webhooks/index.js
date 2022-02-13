import { webhook } from "@/utils/db";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   if (!(await useApiAuth(req, res))) return;
   const webhooks = (await webhook.getAllWebhooks()).map(w => ({ ...w, is_active_string: w.is_active ? 'true' : 'false' }));
   res.json(webhooks);
}