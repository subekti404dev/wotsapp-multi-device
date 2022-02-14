const jwt = require('jsonwebtoken');

const useApiAuth = async (req, res) => {
   const headerToken = (req?.headers?.authorization || '').split(' ')[1];
   if (headerToken === process.env.APP_STATIC_TOKEN) return true;
   const cookieToken = (req?.headers?.cookie || '').split(';').find(x => x.includes('x-app-token'))?.split('=')[1];
   try {
      jwt.verify(cookieToken, process.env.APP_JWT_SECRET, { expiresIn: '1d' });
      return true
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized'
      })
   }
}

export { useApiAuth };