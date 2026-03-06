'use client';

import { AniListAnime } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, ListVideo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getT } from '@/lib/t';

const t = getT('Card');

export default function AnimeCard({ anime }: { anime: AniListAnime }) {

    // 서버에서 이미 번역된 english 필드 우선 사용
    const displayTitle = anime.title.english || anime.title.romaji || anime.title.native;
    const statusKey = anime.status as string;
    // 메시지 파일에 해당 status 키가 있으면 번역, 없으면 원본 사용
    const statusText = (() => {
        try { return t(`status.${statusKey}`); }
        catch { return statusKey; }
    })();

    return (
        <Card className="group relative overflow-hidden bg-card border-none rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/20 hover:z-10 aspect-[3/4]">
            <Link href={`/anime?id=${anime.id}`} className="block w-full h-full">
                {/* Poster Image */}
                <div className="absolute inset-0">
                    <Image
                        src={anime.coverImage.extraLarge || anime.coverImage.large}
                        alt={displayTitle}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        unoptimized
                    />
                </div>

                {/* 평점 배지 */}
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                    {anime.averageScore && anime.averageScore > 0 ? (
                        <Badge className="bg-black/60 backdrop-blur-md text-white border-none flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                            {(anime.averageScore / 10).toFixed(1)}
                        </Badge>
                    ) : null}
                </div>

                {/* 상태 배지 */}
                <div className="absolute top-2 left-2 z-20 flex gap-2">
                    <Badge className="bg-primary/90 text-white border-none text-[10px] px-1.5 py-0">
                        {statusText}
                    </Badge>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 backdrop-blur-md shadow-lg shadow-primary/50">
                        <Play className="h-6 w-6 ml-1 fill-current" />
                    </div>
                </div>

                {/* 하단 정보 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pt-12">
                    <h3 className="text-white font-bold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {displayTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/70 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="flex items-center gap-1 shrink-0">
                            <ListVideo className="h-3 w-3" />
                            {anime.episodes ? `${anime.episodes}화` : t('episodesUnknown')}
                        </span>
                        <span className="truncate">{anime.genres?.[0] || t('genreUnknown')}</span>
                    </div>
                </div>
            </Link>
        </Card>
    );
}
