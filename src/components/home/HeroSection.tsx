'use client';

import { AniListAnime } from '@/lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { getT } from '@/lib/t';

const t = getT('Home');

export default function HeroSection({ anime }: { anime: AniListAnime }) {

    if (!anime) return null;

    // 서버 컴포넌트(page.tsx)에서 이미 한국어로 번역된 데이터를 그대로 사용
    const displayTitle = anime.title.english || anime.title.romaji || anime.title.native;
    const bgImage = anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large;
    const cleanDescription = anime.description?.replace(/<[^>]+>/g, '') || '';

    return (
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-start overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt={displayTitle}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="100vw"
                    referrerPolicy="no-referrer"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent w-full md:w-2/3" />
            </div>

            <div className="container mx-auto px-4 md:px-8 xl:px-12 relative z-10 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-2xl text-white"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                            {t('heroRank')}
                        </span>
                        {anime.averageScore && (
                            <span className="text-secondary/80 font-semibold text-sm">
                                {t('heroScore')}: {(anime.averageScore / 10).toFixed(1)}/10
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight drop-shadow-lg line-clamp-2">
                        {displayTitle}
                    </h1>

                    <p className="text-lg text-white/90 line-clamp-3 mb-8 drop-shadow-md">
                        {cleanDescription}
                    </p>

                    <div className="flex gap-4 items-center">
                        <Link
                            href={`/anime?id=${anime.id}`}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            {t('heroTrailer')}
                        </Link>
                        <Link
                            href={`/anime?id=${anime.id}`}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1"
                        >
                            <Info className="h-5 w-5" />
                            {t('heroDetail')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
