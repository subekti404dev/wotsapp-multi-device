import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const providers = [
   Providers.Credentials({
      name: 'Credentials',
      authorize: async (credentials) => {
         let user = null;
         const username = process.env.USERNAME || 'admin';
         const password = process.env.PASSWORD || 'admin';
         if (credentials.username === username && credentials.password === password) {
            return {
               id: 1,
               username: credentials.username
            }
         }
         if (!user) {
            throw new Error('Invalid credentials')
         }
      },

   })
];

const callbacks = {
   async session(session, user) {
      session.user = user;
      return session
   }
};

const options = {
   providers,
   callbacks,
   secret: 'VERY_SECRET_KEY',
   pages: {
      error: '/'
   }
}

export default (req, res) => NextAuth(req, res, options)