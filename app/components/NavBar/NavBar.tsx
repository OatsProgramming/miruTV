import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import dynamic from "next/dynamic"
import styles from './navBar.module.css'
import SearchDialog from "./SearchDialog/SearchDialog"

const UserDialog = dynamic(() =>
    import("./UserDialog/UserDialog")
)

export default async function NavBar() {
    const session = await getServerSession(authOptions)
    return (
        <nav className={styles['nav']}>
            <Link href='/'>
                <h1>MiruTV</h1>
            </Link>
            <SearchDialog />
            <UserDialog session={session ?? undefined} />
        </nav>
    )
}