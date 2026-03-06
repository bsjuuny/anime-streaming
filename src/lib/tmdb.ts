/**
 * TMDB API 유틸리티
 * - TV 시리즈 검색 → 한국어 제목(name) 및 줄거리(overview) 반환
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TmdbSearchResult {
    id: number;
    name?: string;
    title?: string;
    overview: string;
    original_name?: string;
}

interface TmdbKoreanData {
    title: string | null;
    overview: string | null;
}

// 간단한 인메모리 캐시 (빌드 간 재사용)
const cache = new Map<string, TmdbKoreanData>();

/**
 * AniList 애니 제목으로 TMDB에서 한국어 제목과 줄거리 검색
 * @param query romaji 또는 english 타이틀
 * @param nativeTitle 일본어 원제 (백업 검색에 사용)
 */
const KO_REGEX = /[\uAC00-\uD7A3]/; // 한글 유니코드 범위

export async function getTmdbKoreanData(
    query: string,
    nativeTitle?: string
): Promise<TmdbKoreanData> {
    const cacheKey = query.toLowerCase().trim();
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const result = await searchTmdb(query) || (nativeTitle ? await searchTmdb(nativeTitle) : null);

    // name/title이 실제 한글을 포함하는지 검증
    const rawTitle = result?.name || result?.title || null;
    const koreanTitle = rawTitle && KO_REGEX.test(rawTitle) ? rawTitle : null;
    // overview도 한글이 포함된 경우만 사용
    const rawOverview = result?.overview || null;
    const koreanOverview = rawOverview && KO_REGEX.test(rawOverview) ? rawOverview : null;

    const data: TmdbKoreanData = {
        title: koreanTitle,
        overview: koreanOverview,
    };

    cache.set(cacheKey, data);
    return data;
}

async function searchTmdb(query: string): Promise<TmdbSearchResult | null> {
    if (!TMDB_KEY) {
        console.warn('[TMDB] API 키가 없습니다. 환경 변수 NEXT_PUBLIC_TMDB_API_KEY를 확인하세요.');
        return null;
    }

    try {
        const url = `${TMDB_BASE}/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&include_adult=false`;
        const res = await fetch(url, { next: { revalidate: 86400 } }); // 24시간 캐시

        if (!res.ok) {
            console.warn(`[TMDB] 검색 실패: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        const results: TmdbSearchResult[] = data.results || [];

        if (results.length === 0) return null;

        // 첫 번째 결과 사용 (가장 관련성 높음)
        // overview가 있는 결과 우선
        const withOverview = results.find(r => r.overview && r.overview.length > 10);
        return withOverview || results[0];
    } catch (e) {
        console.error('[TMDB] 에러:', e);
        return null;
    }
}
