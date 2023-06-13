import Link from "next/link";

export default function NotFound() {
    return (
        <section className='notFound'>
            <img
                src='https://i.imgur.com/G5vxPHh.png'
                alt=''
            />
            <h1>404</h1>
            <div className='notFoundOverlay' />
            <div className='notFoundText'>
                <h2>You Seem Lost, Zoro...</h2>
                <div>
                    How about we get back to the <Link href='/'>home</Link> page?
                </div>
            </div>
        </section>
    )
}