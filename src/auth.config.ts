import NextAuth, { NextAuthConfig } from 'next-auth';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import google from 'next-auth/providers/google';
import { Redis } from '@upstash/redis';
import { fetchRedis } from './helpers';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error('GOOGLE_CLIENT_ID is not set');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('GOOGLE_CLIENT_SECRET is not set');
  }

  return { clientId, clientSecret };
}

export const authConfig: NextAuthConfig = {
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    google({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        token.id = user.id!;
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.image = token.picture!;
      }
      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
