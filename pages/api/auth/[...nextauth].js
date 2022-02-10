import NextAuth from 'next-auth'

import Providers from 'next-auth/providers'
const { user: { login } } = require('@/utils/db')


const providers = [
   Providers.Credentials({
      name: 'Credentials',
      // credentials: {
      //    username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
      //    password: { label: 'Password', type: 'password' },
      // },
      authorize: async (credentials) => {
         const user = await login(credentials.username, credentials.password);
         console.log('authorize', user)
         if (!user) {
            throw new Error('Invalid credentials')

         }
         return user;
      },

   })
];

const callbacks = {
   // Getting the JWT token from API response
   // async jwt(token, user) {
   //    if (user) {
   //       token.accessToken = user.token
   //    }
   //    return token
   // },
   async session(session, user) {
      session.user = user;
      return session
   }
};

const options = {
   providers,
   callbacks,
   secret: 'VERY_SECRET_KEY',
}

export default (req, res) => NextAuth(req, res, options)