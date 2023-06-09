import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import FavId from "../FavId/FavId"
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
            <SearchDialog />
            <Link href='/'>HOME</Link>
            <UserDialog session={session ?? undefined} />
        </nav>
    )
}