import { getSessionsData } from "@/utils/session";
import { useApiAuth } from "@/utils/api-auth";

export default async function handler(req, res) {
      if (!(await useApiAuth(req, res))) return;
    const sessions = await getSessionsData();
    const result = sessions.map(session => ({
        session_id: session?.sessionId,
        wa_id: session?.creds?.me?.id,
        wa_name: session?.creds?.me?.name,
    }))
    res.json(result)
}