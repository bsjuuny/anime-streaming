'use client';

import Navbar from '@/components/layout/Navbar';
import FilterSidebar from '@/components/search/FilterSidebar';
import AnimeCard from '@/components/anime/AnimeCard';
import { searchAnime, AniListAnime } from '@/lib/api';
import { translateText } from '@/lib/translator';
import { getTmdbKoreanData } from '@/lib/tmdb';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';

async function translateAnimeData(anime: AniListAnime): Promise<AniListAnime> {
    const originalTitle = anime.title.english || anime.title.romaji || anime.title.native;
    const tmdb = await getTmdbKoreanData(originalTitle, anime.title.native);
    const koreanTitle = tmdb.title || await translateText(originalTitle, 'ko');
    return {
        ...anime,
        title: { ...anime.title, english: koreanTitle },
    };
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const pageParam = searchParams?.get('page') || '1';
    const q = searchParams?.get('q') || undefined;
    const genre = searchParams?.get('genre') || undefined;
    const yearParam = searchParams?.get('year');
    const format = searchParams?.get('format') || undefined;
    const status = searchParams?.get('status') || undefined;
    const scoreParam = searchParams?.get('score');

    const page = parseInt(pageParam, 10);
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const score = scoreParam ? parseInt(scoreParam, 10) : undefined;

    const { data: result, isLoading } = useQuery({
        queryKey: ['searchAnime', page, q, genre, year, format, status, score],
        queryFn: async () => {
            const res = await searchAnime(page, 24, q, genre, year, format, status, score);
            const translatedMedia = await Promise.all(res.media.map(translateAnimeData));
            return {
                ...res,
                media: translatedMedia,
            };
        },
    });

    const buildPageQuery = (newPage: number) => {
        const urlParams = new URLSearchParams(searchParams?.toString() || '');
        urlParams.set('page', newPage.toString());
        return `?${urlParams.toString()}`;
    };

    if (!mounted) return null;

    return (
        <div className="flex-1 flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    {q ? `검색 결과: "${q}"` : '애니메이션 탐색'}
                </h1>
                <span className="text-muted-foreground text-sm font-semibold">
                    {result?.pageInfo?.total || 0} 개의 결과
                </span>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : result && result.media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
                    {result.media.map(anime => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 text-muted-foreground text-lg w-full">
                    검색 결과가 없습니다.
                </div>
            )}

            {/* Pagination */}
            {result && result.pageInfo.lastPage > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 w-full">
                    {result.pageInfo.currentPage > 1 ? (
                        <button
                            onClick={() => router.push(`/search${buildPageQuery(result.pageInfo.currentPage - 1)}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-primary hover:text-white rounded-lg transition-colors font-bold text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" /> 이전
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-muted-foreground rounded-lg font-bold text-sm cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" /> 이전
                        </div>
                    )}

                    <span className="text-white font-bold text-sm bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                        {result.pageInfo.currentPage} / {result.pageInfo.lastPage} 페이지
                    </span>

                    {result.pageInfo.hasNextPage ? (
                        <button
                            onClick={() => router.push(`/search${buildPageQuery(result.pageInfo.currentPage + 1)}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-primary hover:text-white rounded-lg transition-colors font-bold text-sm"
                        >
                            다음 <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-muted-foreground rounded-lg font-bold text-sm cursor-not-allowed">
                            다음 <ChevronRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <Navbar />
            <div className="container mx-auto px-4 md:px-8 xl:px-12 flex flex-col md:flex-row gap-8">
                {/* Sticky Filter Sidebar */}
                <aside className="w-full md:w-64 shrink-0 mt-2">
                    <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-xl" />}>
                        <FilterSidebar />
                    </Suspense>
                </aside>

                <Suspense fallback={<div className="flex-1 flex justify-center py-32"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
                    <SearchContent />
                </Suspense>
            </div>
        </main>
    );
}
