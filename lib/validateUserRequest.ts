import { compare } from "bcrypt"
import prismadb from "./prismadb"

export default async function validateUserRequest(req: Request) {
    try {
        // Find user
        const user = await req.json() as UserRequest

        const userDB = await prismadb.user.findUnique({
            where: { username: user.username }
        })

        if (!userDB) return new Response('User not found', { status: 404 })

        // Check if pw matches
        else if (!await compare(user.password, userDB.hashedPassword)) {
            return new Response('Password mismatch', { status: 401 })
        }

        return user
    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}