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
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-primary/20">
                            {t('heroRank')}
                        </span>
                        {anime.status && (
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {anime.status.replace(/_/g, ' ')}
                            </span>
                        )}
                        {anime.averageScore && (
                            <span className="text-yellow-400 font-bold text-sm flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
                                <span className="text-white/80 font-medium mr-1">{t('heroScore')}</span>
                                {(anime.averageScore / 10).toFixed(1)}/10
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 tracking-tight drop-shadow-2xl line-clamp-2 text-balance leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {displayTitle}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-slate-300 font-medium">
                        {anime.genres?.slice(0, 3).map(genre => (
                            <span key={genre} className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">{genre}</span>
                        ))}
                        {anime.episodes && (
                            <>
                                <span className="text-white/20">•</span>
                                <span>{anime.episodes} EP</span>
                            </>
                        )}
                    </div>

                    <p className="text-lg text-slate-200 line-clamp-3 mb-8 drop-shadow-md leading-relaxed font-medium max-w-[90%]">
                        {cleanDescription}
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                        <Link
                            href={`/anime?id=${anime.id}`}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(61,180,242,0.4)] hover:shadow-[0_0_30px_rgba(61,180,242,0.6)] transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            {t('heroTrailer')}
                        </Link>
                        <Link
                            href={`/anime?id=${anime.id}`}
                            className="flex items-center gap-2 glass-panel glass-panel-hover px-8 py-3.5 rounded-2xl font-bold text-white transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            <Info className="h-5 w-5" />
                            {t('heroDetail')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section >
    );
}
