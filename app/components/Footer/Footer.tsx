import Link from 'next/link'
import styles from './footer.module.css'
import github from '@/public/github.svg'
import email from '@/public/email.svg'
import Image from 'next/image'

// Note: Add a way to contact (Get email service)
export default function Footer() {
    return (
        <section className={styles['container']}>
            <div className={styles['text']}>
                MiruTV is not affiliated with or endorsed by any of the anime studios behind the creation of the anime presented on this site. This website is only an user interface presenting/linking various self-hosted files across the internet by other third-party providers for easy access. MiruTV never downloads the video from any source provider, link will be returned from the response hence it is completely not subjected to DMCA compliant.
            </div>
            <div className={styles['iconsContainer']}>
                <Link href='/'>
                    <Image
                        src={github}
                        alt='Github Icon'
                        width={100}
                        height={100}
                    />
                </Link>
                <Link href='/'>
                    <Image
                        src={email}
                        alt='Email Icon'
                        width={100}
                        height={100}
                    />
                </Link>
            </div>
        </section>
    )
}