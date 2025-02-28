import NextAuth, { User } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './lib/db/drizzle';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { users } from './lib/db/schema';
import { encode as defaultEncode } from 'next-auth/jwt';
import { v4 as uuid } from 'uuid';

const adapter = DrizzleAdapter(db);
const providers: any[] = [GitHub];

if (process.env.NODE_ENV === 'development') {
  providers.push(
    Credentials({
      id: 'password',
      name: 'Password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials.password === 'password') {
          const user = await db
            .insert(users)
            .values({
              name: 'test user',
              email: 'test@email.test',
            })
            .onConflictDoUpdate({
              target: users.email,
              set: { name: 'test user' },
            })
            .returning({
              id: users.id,
              name: users.name,
              email: users.email,
              image: users.image,
              emailVerified: users.emailVerified,
            });

          return user[0] as User;
        }
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.type === 'credentials') {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
