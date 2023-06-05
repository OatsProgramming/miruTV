import prismadb from "@/lib/prismadb"
import validateUserRequest from "@/lib/validateUserRequest"
import { hash } from "bcrypt"

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json() as UserRequest
        const hashedPassword = await hash(password, 12)

        await prismadb.user.create({
            data: {
                username,
                hashedPassword,
                favIds: {
                    create: []
                }
            },
        })

        return new Response(JSON.stringify({ username, password }), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await validateUserRequest(req)
        if (user instanceof Response) return user

        // hash the pw if creating a new one
        let hashedPassword: string | undefined;
        if (user.newInfo?.password) {
            hashedPassword = await hash(user.newInfo.password, 12)
        }

        await prismadb.user.update({
            where: {
                username: user.username
            },
            data: {
                username: user.newInfo?.username,
                hashedPassword: hashedPassword 
            }
        })

        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await validateUserRequest(req)
        if (user instanceof Response) return user

        await prismadb.user.delete({
            where: { username: user.username }
        })

        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}