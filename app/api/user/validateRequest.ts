type Essential = {
    username: string,
    password: string,
}

type PATCH = Essential & {
    method: 'PATCH',
    newInfo: UserRequest['newInfo']
}

type POST = Essential & {
    method: 'POST' | 'DELETE'
}

type DELETE = POST

// DONT FORGET TO RETURN METHOD IN EACH ONE
export default async function validateRequest<T extends PATCH | POST | DELETE>(req: Request) {
    try {
        const { data, method } = await req.json() as RequestBody<UserRequest>
        console.log(data, method)
        switch(method) {
            case 'DELETE':
            case "POST": {
                const { username, password } = data
                if (!username || !password) {
                    return new Response(
                        `Is missing...
                        Username?   ${!username}
                        Password?   ${!password}`,
                        { status: 422 }
                    )
                }
                break;
            }
            case "PATCH": {
                const { username, password, newInfo } = data
                if (!username || !password || !newInfo) {
                    return new Response(
                        `Is missing...
                        Username?   ${!username}
                        Password?   ${!password}
                        New Info?   ${!newInfo}`,
                        { status: 422 }
                    )
                }
                break;
            }
            default: {
                throw new Error("Invalid Method")
            }
        }

        return {
            ...data,
            method
        } as T


    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}