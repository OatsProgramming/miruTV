// Mostly made this just for me & my need for type safety
type ReturnType = {
    PATCH: {
        method: 'PATCH',
    } & Required<UserRequest> & Required<UserRequest['newInfo']>
} & Record<'DELETE' | 'POST', { 
    method: 'DELETE' | 'POST'
} & Pick<UserRequest, 'username' | 'password'>>

// DONT FORGET TO RETURN METHOD IN EACH ONE
export default async function validateRequest(req: Request) {
    try {
        const { data, method } = await req.json() as RequestBody<UserRequest>
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
                return { username, password, method } as ReturnType['DELETE']
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
                return { username, password, newInfo, method } as ReturnType['PATCH']
            }
            default: {
                throw new Error("Invalid Method")
            }
        }


    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}