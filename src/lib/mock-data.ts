export interface Anime {
    id: string;
    title: string;
    originalTitle?: string;
    synopsis: string;
    coverImage: string;
    bannerImage: string;
    genre: string[];
    status: 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED';
    score: number;
    episodes?: number;
    studio?: string;
}

export const heroAnime: Anime = {
    id: '1',
    title: 'Neon Genesis: Neo Tokyo',
    originalTitle: 'ネオン・ジェネシス：ネオ東京',
    synopsis: 'In a breathtaking futuristic city lit by neon, a lone survivor must navigate the dangerous underworld to find the truth behind the corrupted government and her own forgotten past. Every frame is a cinematic masterpiece of dark, vibrant aesthetics.',
    coverImage: '/hero_banner_1_1772217359967.png',
    bannerImage: '/hero_banner_1_1772217359967.png',
    genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
    status: 'RELEASING',
    score: 9.2,
    episodes: 24,
    studio: 'Studio Trigger',
};

export const trendingNow: Anime[] = [
    {
        id: '2',
        title: 'The Dark Swordsman',
        originalTitle: '黒の剣士',
        synopsis: 'A fantasy swordsman in dark armor looking determined, standing amongst the ruins of a fallen kingdom.',
        coverImage: '/poster_1_1772217390916.png',
        bannerImage: '/poster_1_1772217390916.png',
        genre: ['Dark Fantasy', 'Action', 'Drama'],
        status: 'RELEASING',
        score: 8.9,
        episodes: 12,
        studio: 'MAPPA',
    },
    {
        id: '3',
        title: 'Starry Magic',
        originalTitle: '星空のマジック',
        synopsis: 'A magical girl flying in a starry sky, bringing hope to a world consumed by darkness.',
        coverImage: '/poster_2_1772217417254.png',
        bannerImage: '/poster_2_1772217417254.png',
        genre: ['Magical Girl', 'Fantasy', 'Adventure'],
        status: 'FINISHED',
        score: 9.5,
        episodes: 26,
        studio: 'Studio Ghibli',
    },
    {
        id: '4',
        title: 'Cyber Hunter',
        coverImage: '/hero_banner_1_1772217359967.png',
        bannerImage: '/hero_banner_1_1772217359967.png',
        synopsis: 'Bounty hunters in a cyberpunk era.',
        genre: ['Sci-Fi', 'Action'],
        status: 'RELEASING',
        score: 8.5,
    },
    {
        id: '5',
        title: 'Sword of Ruin',
        coverImage: '/poster_1_1772217390916.png',
        bannerImage: '/poster_1_1772217390916.png',
        synopsis: 'The sword that ends the world.',
        genre: ['Fantasy', 'Action'],
        status: 'NOT_YET_RELEASED',
        score: 0,
    }
];

export const topRated: Anime[] = [
    ...trendingNow.slice().reverse()
];

export const upcoming: Anime[] = [
    ...trendingNow.slice(1, 4)
];
