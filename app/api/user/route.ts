import prismadb from "@/lib/prismadb"
import { hash, compare } from "bcrypt"
import validateRequest from "./validateRequest"
import { getServerSession } from "next-auth/next"
import authOptions from "../auth/[...nextauth]/options"
import handleError from "@/app/util/handleError"
import isEqual from 'lodash/isEqual'

export async function POST(req: Request) {
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    let username, password;
    const { username: name, password: pw, method } = res

    username = name.trim()
    password = pw.trim()
    try {
        switch (method) {
            case 'DELETE':
            case 'PATCH': {
                // Check if user is signed in before making changes
                const session = await getServerSession(authOptions)
                if (!session) return new Response("Sign in to make changes.", { status: 401 })

                // Compare by session id instead of user name for added safety
                const currentUserPromise = prismadb.user.findUnique({
                    where: { id: session.user.id }
                })

                const targetUserPromise = prismadb.user.findUnique({
                    where: { username }
                })

                const [currentUser, targetUser] = await Promise.all([currentUserPromise, targetUserPromise])

                if (!currentUser || !targetUser) {
                    return new Response(
                        `The following could not be found in the database:
                        Current User?       ${!currentUser}
                        Target User?        ${!targetUser}`,
                        { status: 404 }
                    )
                }

                else if (!isEqual(currentUser, targetUser)) {

                    return new Response(
                        `If planning to make changes to ${username}, please sign in as ${username}`,
                        { status: 401 }
                    )
                }

                // Check pw
                else if (!await compare(password, targetUser.hashedPassword)) {

                    return new Response("Password mismatch.", { status: 401 })
                }

                // Now get to actual business
                if (method === 'DELETE') {
                    await prismadb.user.delete({
                        where: { id: targetUser.id }
                    })
                    break;
                }

                else if (method === 'PATCH') {
                    const { newInfo } = res
                    const newName = newInfo?.username?.trim()
                    const newPW = newInfo?.password?.trim()

                    let commentsPromise;
                    // If new username, make sure that its not taken
                    if (newName) {
                        const userExists = await prismadb.user.findUnique({
                            where: { username: newName }
                        })
                        if (userExists) return new Response(
                            `The username, ${userExists.username}, is already taken. Please enter a different username.`,
                            { status: 409 }
                        )

                        // Otherwise, update not just user, but comments also
                        commentsPromise = prismadb.comment.updateMany({
                            where: { userId: targetUser.id },
                            data: {
                                createdBy: newName
                            }
                        })
                    }

                    // Hash the pw if new pw
                    let hashedPassword;
                    if (newPW) {
                        hashedPassword = await hash(newPW, 12)
                    }

                    // Update the user with any new changes
                    const userPromise = prismadb.user.update({
                        where: { id: targetUser.id },
                        data: {
                            username: newName || targetUser.username,
                            hashedPassword: hashedPassword || targetUser.hashedPassword
                        }
                    })

                    // Batch it all together
                    await Promise.all([userPromise, commentsPromise])
                }
                break;
            }
            case 'POST': {
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
    } catch (err) {
        return handleError(err)
    }
}