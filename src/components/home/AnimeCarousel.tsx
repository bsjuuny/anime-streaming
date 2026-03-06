'use client';

import { AniListAnime } from '@/lib/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Autoplay } from 'swiper/modules';
import AnimeCard from '@/components/anime/AnimeCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AnimeCarouselProps {
    title: string;
    animes: AniListAnime[];
    href?: string;
}

export default function AnimeCarousel({ title, animes, href = "/search" }: AnimeCarouselProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="py-8 md:py-12 w-full">
            <div className="container mx-auto px-4 md:px-8 xl:px-12 mb-6 flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-bold border-l-4 border-primary pl-4 text-foreground/90">
                    {title}
                </h2>
                <Link href={href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold flex items-center gap-1 group">
                    전체 보기
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </div>

            <div className="w-full pl-4 md:pl-8 xl:pl-12 min-h-[300px]">
                {!mounted ? (
                    <div className="flex gap-4 md:gap-6 pr-4 md:pr-8 overflow-hidden pointer-events-none">
                        {animes.slice(0, 6).map((anime) => (
                            <div key={anime.id} className="w-[160px] md:w-[200px] shrink-0">
                                <AnimeCard anime={anime} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, A11y, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 24 },
                            1024: { slidesPerView: 5, spaceBetween: 24 },
                            1280: { slidesPerView: 6, spaceBetween: 28 },
                        }}
                        navigation
                        autoplay={{ delay: 5000, disableOnInteraction: true }}
                        className="pr-4 md:pr-8"
                    >
                        {animes.map((anime) => (
                            <SwiperSlide key={anime.id} className="py-2">
                                <AnimeCard anime={anime} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
