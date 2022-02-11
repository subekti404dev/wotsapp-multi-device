import { getSession as getAuthSession } from "next-auth/client";

const useApiAuth = async (req, res) => {
   const auth = await getAuthSession({ req });
   const token = (req?.headers?.authorization || '').split(' ')[1]
   const authenticated = auth?.user || token === process.env.API_TOKEN;  
   if (!authenticated) {
      res.status(401).json({
         success: false,
         message: 'Unauthorized'
      });
      return false;
   }
   return true;
}

export { useApiAuth };