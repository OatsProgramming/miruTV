import prismadb from "@/lib/prismadb"
import { hash, compare } from "bcrypt"
import validateRequest from "./validateRequest"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    const { username, password, method } = res

    switch(method) {
        case 'DELETE':
        case 'PATCH': {
            // Check if user is signed in before making changes
            const session = await getServerSession(authOptions)
            if (!session) return new Response("Sign in to make changes.", { status: 401 })

            // Compare by session id instead of user name for added safety
            const user = await prismadb.user.findUnique({
                where: { id: session.user.id }
            })

            if (!user) return new Response("User not found", { status: 404 })

            // Check pw
            else if (!await compare(password, user.hashedPassword)) {
                return new Response("Password mismatch.", { status: 401 })
            }

            // Now get to actual business
            if (method === 'DELETE') {
                await prismadb.user.delete({ 
                    where: { id: session.user.id }
                })
                break;
            }

            else if (method === 'PATCH') {
                
                let hashedPassword;
                if (res.newInfo?.password) {
                    hashedPassword = await hash(password, 12)
                }

                await prismadb.user.update({
                    where: { id: session.user.id },
                    data: {
                        username: res.newInfo?.username ?? user.username,
                        hashedPassword: hashedPassword ?? user.hashedPassword
                    }
                })
                break;
            }
            break;
        }
        case 'POST' : {
            const hashedPassword = await hash(password, 12)

            await prismadb.user.create({
                data: {
                    username,
                    hashedPassword,
                    favIds: []
                }
            })
            break;
        }
        default: {
            throw new Error("This shouldn't happen. Invalid method given at route handler.")
        }
    }
    
    return new Response(JSON.stringify(res), { status: 200 })

}