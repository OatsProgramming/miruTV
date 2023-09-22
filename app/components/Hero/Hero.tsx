'use client'

import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { Options } from '@splidejs/react-splide';
import styles from './hero.module.css'
import Link from 'next/link'

export default function Hero({ animes }: {
    animes: AnimePopularResult['results']
}) {

    const splideOptions: Options = {
        autoplay: true,
        direction: 'ttb',
        drag: 'free',
        snap: true,
        focus: 'center',
        lazyLoad: 'nearby',
        heightRatio: 0.21,
        arrows: false,
        interval: 5000,
        easing: 'ease-in-out',
        type: 'loop',
        speed: 500,
        pauseOnHover: true,
        pagination: false,
    }

    return (
        <Splide options={splideOptions} className={styles['splide']}>
            {animes.map(anime => {
                const title = typeof anime.title === 'string'
                    ? anime.title
                    : anime.title.english ?? anime.title.native ?? 'N/A'
                    
                return (
                    <SplideSlide key={anime.id} className={styles['content']}>
                        <Link href={`/info/${anime.id}`}>
                            <img
                                loading='lazy'
                                src={anime.cover}
                                alt={title}
                            />
                            <div className={styles['text']}>
                                <h1>{title}</h1>
                                <button>Watch Now</button>
                            </div>
                        </Link>
                    </SplideSlide>
                )
            })}
        </Splide>
    )
}