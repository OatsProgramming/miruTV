import Link from 'next/link'
import styles from './footer.module.css'
import github from '@/public/github.svg'
import Image from 'next/image'
import EmailContact from '../EmailDialog/EmailContact'
import discord from '@/public/discord.svg'


// Note: Add a way to contact (Get email service)
export default function Footer() {
    return (
        <section className={styles['container']}>
            <div className={styles['text']}>
                <h1>MiruTV</h1>
                <div className={styles['disclaimer']}>
                    MiruTV is not affiliated with or endorsed by any of the anime studios behind the creation of the anime presented on this site. This website is only an user interface presenting/linking various self-hosted files across the internet by other third-party providers for easy access. MiruTV never downloads the video from any source provider, link will be returned from the response hence it is completely not subjected to DMCA compliant.
                </div>
                <div className={styles['iconsContainer']}>
                    <Link href='https://github.com/OatsProgramming/miruTV' target="_blank" rel='noreferrer noopener'>
                        <Image
                            src={github}
                            alt='Github Icon'
                            width={100}
                            height={100}
                        />
                    </Link>
                    <Link href='https://discord.gg/WUhmy8CaB' target='_blank' rel='noreferrer noopener'>
                        <Image
                            src={discord}
                            alt='Discord Icon'
                            width={100}
                            height={100}
                        />
                    </Link>
                </div>
            </div>
            <div className={styles['contact']}>
                <h1>Got A Confession?</h1>
                <h3>Send it my way ;)</h3>
                <EmailContact />
                
            </div>
        </section>
    )
}