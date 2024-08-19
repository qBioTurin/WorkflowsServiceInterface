import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: 'nextjs-client',
      clientSecret: 'your_keycloak_client_secret',
      issuer: 'http://localhost:8080/auth/realms/myrealm',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
