import styles from './card.module.css'

export default function Card({ img, title }: {
    img: string,
    title: string,
}) {
    return (
        <div className={styles['card']}>
            <img
                loading='lazy'
                src={img}
                width={300}
                height={400}
            />
            <h2>{title}</h2>
        </div>
    )
}