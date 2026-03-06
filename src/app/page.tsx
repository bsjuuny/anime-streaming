import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AnimeCarousel from '@/components/home/AnimeCarousel';
import { getTrendingAnime, getTopRatedAnime, getUpcomingAnime, AniListAnime } from '@/lib/api';
import { translateText } from '@/lib/translator';
import { getTmdbKoreanData } from '@/lib/tmdb';
import DonationPopup from '@/components/ui/DonationPopup';

export const revalidate = 3600;

async function translateAnimeData(anime: AniListAnime): Promise<AniListAnime> {
  const originalTitle = anime.title.english || anime.title.romaji || anime.title.native;
  // TMDB 한국어 제목 조회, 없으면 translateText 백업
  const tmdb = await getTmdbKoreanData(originalTitle, anime.title.native);
  const koreanTitle = tmdb.title || await translateText(originalTitle, 'ko');
  return {
    ...anime,
    title: { ...anime.title, english: koreanTitle },
  };
}

export default async function Home() {
  const [trendingRaw, topRatedRaw, upcomingRaw] = await Promise.all([
    getTrendingAnime(),
    getTopRatedAnime(),
    getUpcomingAnime()
  ]);

  // Translate titles for all lists
  const [trending, topRated, upcoming] = await Promise.all([
    Promise.all(trendingRaw.map(translateAnimeData)),
    Promise.all(topRatedRaw.map(translateAnimeData)),
    Promise.all(upcomingRaw.map(translateAnimeData))
  ]);

  const heroAnime = trending[0];
  // TMDB overview 또는 translateText로 히어로 설명 번역
  const heroTmdb = await getTmdbKoreanData(
    heroAnime.title.english || heroAnime.title.romaji,
    heroAnime.title.native
  );
  const cleanHeroDesc = heroAnime.description?.replace(/<[^>]+>/g, '') || '';
  const heroDescription = (heroTmdb.overview && heroTmdb.overview.length > 10)
    ? heroTmdb.overview
    : await translateText(cleanHeroDesc, 'ko');
  const heroWithKoreanDesc = { ...heroAnime, description: heroDescription };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      <HeroSection anime={heroWithKoreanDesc} />

      <div className="relative -mt-20 z-20 space-y-12 bg-gradient-to-t from-background via-background to-transparent pt-20">
        <AnimeCarousel title="지금 인기 급상승 중" animes={trending} href="/search?status=RELEASING" />
        <AnimeCarousel title="역대 최고 평점작" animes={topRated} href="/search?score=8" />
        <AnimeCarousel title="다음 시즌 기대작" animes={upcoming} href="/search?status=NOT_YET_RELEASED" />
      </div>
      <DonationPopup />
    </main>
  );
}
