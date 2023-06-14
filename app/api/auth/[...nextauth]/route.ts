import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from '@/lib/prismadb'
import { compare } from 'bcrypt';
import redis from '@/lib/redis';
import type { User } from '@prisma/client';

// export this so we can use later for getServerSession or whatnot
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
                const defaultTTL = 120 // caching since user could accidentally put the wrong pw
                const username = credentials?.username.trim()
                const password = credentials?.password.trim()

                // Check for any missing properties
                if (!username || !password) return null


                let user: User;
                // Check redis if it has it first
                const cachedUser = await redis.get(username)
                if (cachedUser) {
                    user = JSON.parse(cachedUser)
                    console.log("USER CACHE HIT")
                }

                // If not then check db
                else {
                    const userDB = await prismadb.user.findUnique({
                        where: { username }
                    })

                    if (!userDB) return null

                    // Cache it if exists
                    await redis.setex(userDB.username, defaultTTL, JSON.stringify(userDB))
                    user = userDB
                    console.log("USER CACHE MISS")
                }

                // Use compare from bcrypt since it'd be hashed
                if (!await compare(password, user.hashedPassword)) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.username,
                    favIds: user.favIds
                };
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id ,
                    name: token.name,
                    favIds: token.favIds
                },
            };
        },
        jwt: ({ token, user, trigger, session }) => {
            if (trigger === 'update') {
                // Validate the data
                if (session.favIds) {
                    token.favIds = session.favIds
                }
                else if (session.name) {
                    token.name = session.name
                }
            }
            // Exec on sign in
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    favIds: user.favIds 
                }
            }
            // Exec on reg
            return token
        }
    }
}

// Export it like this so that next auth can use this
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }