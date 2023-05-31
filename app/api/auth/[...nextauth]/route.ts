import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from '@/lib/prismadb'
import { compare } from 'bcrypt';

// export this so we can use later for getServerSession or whatnot
// Apparently it will make its own form with it's own design?
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt'
    },
    providers: [
        // For anonymity, only username and pw
        Credentials({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: 'text',
                    placeholder: 'OatsProgramming'
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            authorize: async (credentials) => {
                // Check for any missing properties
                if (!credentials?.username || !credentials.password) {
                    return null;
                }

                // Check the db if user exists
                const user = await prismadb.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                })

                if (!user) {
                    return null
                }

                // Use compare from bcrypt since it'd be hashed
                if (!await compare(credentials.password, user.hashedPassword)) {
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username,
                    favIds: user.favIds
                };
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            // console.log("Session Callback", { session, token });
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                },
            };
        },
        jwt: ({ token, user }) => {
            // console.log("JWT Callback", { token, user })
            if (user) {
                return {
                    ...token,
                    id: user.id,
                }
            }
            return token
        }
    }
}

// Export it like this so that next auth can use this
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }