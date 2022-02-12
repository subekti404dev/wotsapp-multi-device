import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
   if (!(await useApiAuth(req, res))) return;
   const uptime = process.uptime();
   res.json({ uptime });
}