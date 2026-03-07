export interface AniListAnime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage: string | null;
  genres: string[];
  status: string;
  averageScore: number;
  episodes: number;
  studios: {
    nodes: { name: string }[];
  };
  trailer?: {
    id: string;
    site: string;
  };
  characters?: {
    edges: {
      node: {
        id: number;
        name: { full: string };
        image: { large: string };
      };
      role: string;
      voiceActors: {
        id: number;
        name: { full: string };
        image: { large: string };
      }[];
    }[];
  };
  recommendations?: {
    nodes: {
      mediaRecommendation: AniListAnime;
    }[];
  };
}

export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface SearchResult {
  pageInfo: PageInfo;
  media: AniListAnime[];
}

const ANILIST_URL = 'https://graphql.anilist.co';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function fetchAniListAPI(query: string, variables: any = {}, retries = 5): Promise<any> {
  const cacheKey = JSON.stringify({ query, variables });
  const cached = cache.get(cacheKey);

  // Return cached data if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(ANILIST_URL, options);

      if (response.ok) {
        const data = await response.json();
        // Save to cache
        cache.set(cacheKey, { data: data.data, timestamp: Date.now() });
        return data.data;
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, i) * 1500;
        console.warn(`[AniList API] Rate limited (429). Retrying in ${delayMs}ms... (Attempt ${i + 1}/${retries})`);
        await delay(delayMs);
        continue;
      }

      throw new Error(`AniList API Error: ${response.status} ${response.statusText}`);
    } catch (error: any) {
      if (i === retries - 1) throw error;
      console.warn(`[AniList API] Fetch error: ${error.message}. Retrying... (Attempt ${i + 1}/${retries})`);
      await delay(Math.pow(2, i) * 1000);
    }
  }

  throw new Error('AniList API Error: Maximum retries reached due to rate limiting or network issues.');
}

export async function getTrendingAnime(): Promise<AniListAnime[]> {
  const query = `
    query {
      Page(page: 1, perPage: 15) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english native }
          description
          coverImage { large extraLarge }
          bannerImage
          genres
          status
          averageScore
          episodes
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;

  const data = await fetchAniListAPI(query);
  return data.Page.media;
}

export async function getTopRatedAnime(): Promise<AniListAnime[]> {
  const query = `
    query {
      Page(page: 1, perPage: 15) {
        media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
          id
          title { romaji english native }
          description
          coverImage { large extraLarge }
          bannerImage
          genres
          status
          averageScore
          episodes
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;
  const data = await fetchAniListAPI(query);
  return data.Page.media;
}

export async function getUpcomingAnime(): Promise<AniListAnime[]> {
  const query = `
    query {
      Page(page: 1, perPage: 15) {
        media(sort: POPULARITY_DESC, type: ANIME, status: NOT_YET_RELEASED, isAdult: false) {
          id
          title { romaji english native }
          description
          coverImage { large extraLarge }
          bannerImage
          genres
          status
          averageScore
          episodes
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;
  const data = await fetchAniListAPI(query);
  return data.Page.media;
}

export async function getAnimeById(id: number): Promise<AniListAnime> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        description
        coverImage { large extraLarge }
        bannerImage
        genres
        status
        averageScore
        episodes
        trailer { id site }
        studios(isMain: true) { nodes { name } }
        characters(sort: ROLE, perPage: 6) {
          edges {
            role
            node { id name { full } image { large } }
            voiceActors(language: JAPANESE, sort: RELEVANCE) { id name { full } image { large } }
          }
        }
        recommendations(sort: RATING_DESC, perPage: 10) {
          nodes {
            mediaRecommendation {
              id
              title { romaji english native }
              coverImage { large extraLarge }
              averageScore
              episodes
              genres
              status
            }
          }
        }
      }
    }
  `;
  const data = await fetchAniListAPI(query, { id });
  return data.Media;
}

export async function searchAnime(
  page: number = 1,
  perPage: number = 24,
  search?: string,
  genre?: string,
  year?: number,
  format?: string,
  status?: string,
  score?: number
): Promise<SearchResult> {
  const query = `
    query (
      $page: Int, 
      $perPage: Int, 
      $search: String, 
      $genre: String, 
      $seasonYear: Int, 
      $format: MediaFormat,
      $status: MediaStatus,
      $averageScore_greater: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(
          search: $search, 
          genre: $genre, 
          seasonYear: $seasonYear, 
          format: $format,
          status: $status,
          averageScore_greater: $averageScore_greater,
          type: ANIME, 
          sort: [POPULARITY_DESC]
        ) {
          id
          title { romaji english native }
          description
          coverImage { large extraLarge }
          bannerImage
          genres
          status
          averageScore
          episodes
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `;

  const variables = {
    page,
    perPage,
    ...(search && { search }),
    ...(genre && genre !== "ALL" && { genre }),
    ...(year && { seasonYear: year }),
    ...(format && format !== "ALL" && { format }),
    ...(status && status !== "ALL" && { status }),
    ...(score && score > 0 && { averageScore_greater: score * 10 - 1 })
  };

  const data = await fetchAniListAPI(query, variables);
  return data.Page;
}
