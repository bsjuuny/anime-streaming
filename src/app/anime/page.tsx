'use client';

import { getAnimeById, AniListAnime } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { Star, Layers, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TrailerModal from '@/components/anime/TrailerModal';
import AnimeCarousel from '@/components/home/AnimeCarousel';
import { translateText } from '@/lib/translator';
import { getTmdbKoreanData } from '@/lib/tmdb';
import { getT } from '@/lib/t';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';

const t = getT('Detail');

function AnimeDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id');

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['animeDetail', id],
        queryFn: async () => {
            const anime = await getAnimeById(parseInt(id as string, 10));
            if (!anime) return null;

            // TMDB 한국어 데이터 조회 (백업: translateText)
            const originalTitle = anime.title.english || anime.title.romaji || anime.title.native;
            const tmdb = await getTmdbKoreanData(
                anime.title.english || anime.title.romaji,
                anime.title.native
            );
            const displayTitle = tmdb.title || await translateText(originalTitle, 'ko');

            const coverImage = anime.coverImage.extraLarge || anime.coverImage.large;
            const bgImage = anime.bannerImage || coverImage;
            const cleanDescription = anime.description?.replace(/<[^>]+>/g, '') || t('noSynopsis');
            // TMDB overview가 있으면 사용, 없으면 translateText로 번역
            const translatedDescription = (tmdb.overview && tmdb.overview.length > 10)
                ? tmdb.overview
                : await translateText(cleanDescription, 'ko');

            // 장르 한국어 번역
            const translatedGenres = await Promise.all(
                (anime.genres || []).map(g => translateText(g, 'ko'))
            );

            const recommendationsRaw: AniListAnime[] = anime.recommendations?.nodes.map(n => n.mediaRecommendation as AniListAnime).filter(Boolean) || [];

            // 추천 작품 제목 번역
            const recommendations = await Promise.all(recommendationsRaw.map(async (rec) => {
                const recOriginalTitle = rec.title.english || rec.title.romaji || rec.title.native;
                const recTmdb = await getTmdbKoreanData(recOriginalTitle, rec.title.native);
                const recKoreanTitle = recTmdb.title || await translateText(recOriginalTitle, 'ko');
                return {
                    ...rec,
                    title: { ...rec.title, english: recKoreanTitle }
                };
            }));

            return {
                anime,
                displayTitle,
                bgImage,
                coverImage,
                translatedDescription,
                translatedGenres,
                recommendations
            };
        },
        enabled: !!id,
    });

    if (!mounted) return null;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Navbar />
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </main>
        );
    }

    if (error || !data || !data.anime) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="text-center text-white mt-32">{t('not_found')}</div>
            </main>
        );
    }

    const { anime, displayTitle, bgImage, coverImage, translatedDescription, translatedGenres, recommendations } = data;

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <section className="relative w-full h-[50vh] min-h-[400px]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bgImage}
                        alt={displayTitle}
                        fill
                        priority
                        className="object-cover object-top blur-sm brightness-50"
                        sizes="100vw"
                        referrerPolicy="no-referrer"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-8 xl:px-12 relative z-10 -mt-32 md:-mt-48 flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 shrink-0 mix-blend-normal">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-background bg-card">
                        <Image
                            src={coverImage}
                            alt={displayTitle}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            referrerPolicy="no-referrer"
                            unoptimized
                        />
                    </div>

                    <div className="flex flex-col gap-3 bg-secondary/30 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">{t('score')}</span>
                                <div className="flex items-center gap-1 font-semibold text-lg text-white">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                                    {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">{t('status')}</span>
                                <span className="font-semibold text-sm text-primary">
                                    {t(`status_values.${anime.status}`, { defaultValue: anime.status })}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">{t('episodes')}</span>
                                <span className="font-semibold text-sm text-white">
                                    {anime.episodes ?? t('episodesUnknown')}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">{t('studio')}</span>
                                <span className="font-semibold text-sm text-white line-clamp-1">
                                    {anime.studios?.nodes?.[0]?.name || t('studioUnknown')}
                                </span>
                            </div>
                        </div>

                        <hr className="border-white/10 my-2" />

                        <div className="flex flex-col gap-2">
                            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">{t('genres')}</span>
                            <div className="flex flex-wrap gap-2">
                                {translatedGenres.map((genre, i) => (
                                    <Badge key={i} variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30 border-none px-2 py-0.5 text-xs font-semibold">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-8 md:pt-20">
                    <div className="flex flex-col gap-3 mt-4 md:mt-0">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                            {displayTitle}
                        </h1>

                        <div className="flex items-center gap-4 mt-4">
                            {anime.trailer?.id && (
                                <TrailerModal videoId={anime.trailer.id} site={anime.trailer.site} />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Layers className="text-primary w-5 h-5" />
                            {t('synopsis')}
                        </h3>
                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                            {translatedDescription}
                        </p>
                    </div>

                    {anime.characters?.edges && anime.characters.edges.length > 0 && (
                        <div className="flex flex-col gap-4 mt-4">
                            <h3 className="text-xl font-bold text-white">{t('characters')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {anime.characters.edges.map((edge) => {
                                    const character = edge.node;
                                    const va = edge.voiceActors?.[0];
                                    const roleKey = edge.role.toLowerCase();
                                    return (
                                        <div key={character.id} className="flex bg-secondary/20 rounded-xl overflow-hidden border border-white/5 hover:bg-secondary/40 transition-colors h-24">
                                            <div className="w-1/2 flex items-center">
                                                <div className="relative h-full w-16 shrink-0">
                                                    <Image src={character.image.large} alt={character.name.full} fill className="object-cover" referrerPolicy="no-referrer" unoptimized />
                                                </div>
                                                <div className="p-3 text-xs flex flex-col justify-center">
                                                    <span className="font-bold text-white line-clamp-2">{character.name.full}</span>
                                                    <span className="text-primary">
                                                        {t(`role.${roleKey}`, { defaultValue: edge.role })}
                                                    </span>
                                                </div>
                                            </div>

                                            {va && (
                                                <div className="w-1/2 flex items-center flex-row-reverse bg-black/20 text-right">
                                                    <div className="relative h-full w-16 shrink-0">
                                                        <Image src={va.image.large} alt={va.name.full} fill className="object-cover" referrerPolicy="no-referrer" unoptimized />
                                                    </div>
                                                    <div className="p-3 text-xs flex flex-col justify-center">
                                                        <span className="font-bold text-white line-clamp-2">{va.name.full}</span>
                                                        <span className="text-muted-foreground text-[10px] uppercase">{t('voiceActor')}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="mt-12">
                    <AnimeCarousel title={t('recommended')} animes={recommendations} />
                </div>
            )}
        </main>
    );
}

export default function AnimeDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex flex-col items-center justify-center"><Navbar /><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}>
            <AnimeDetailContent />
        </Suspense>
    );
}
