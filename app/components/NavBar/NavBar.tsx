import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import FavId from "../FavId/FavId"
import dynamic from "next/dynamic"
import styles from './navBar.module.css'

const SignOut = dynamic(() =>
    import("../AuthBtns/SignOut")
)

const SigninDialog = dynamic(() =>
    import("../SigninDialog/SigninDialog")
)

export default async function NavBar() {
    const session = await getServerSession(authOptions)
    return (
        <div>
            {session ? (
                <>
                    <SignOut />
                    <div>{JSON.stringify(session.user.name)}</div>
                </>
            ) : (
                <>
                    <SigninDialog />
                </>
            )}
            <Link href='/'>HOME</Link>
            <FavId />
        </div>
    )
}