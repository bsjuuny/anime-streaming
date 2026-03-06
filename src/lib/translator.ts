/**
 * 번역 유틸리티
 * - 1차: TMDB API (getTmdbKoreanData에서 처리)
 * - 2차: MyMemory Translation API (무료, 요청 제한 완화)
 * - 3차: 원본 텍스트 반환 (API 실패 시)
 *
 * 브라우저 및 정적 빌드 호환 구조: 브라우저에서는 localStorage 사용.
 */

const CACHE_KEY_PREFIX = 'animefinder_trans_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7일

// 인메모리 캐시 (서버 사이드 빌드용)
const memCache: Record<string, { value: string; timestamp: number }> = {};

// 한글 포함 여부 확인
const KO_REGEX = /[\uAC00-\uD7A3]/;

/** 브라우저인지 확인 */
const isBrowser = typeof window !== 'undefined';

/** 캐시 조회 (메모리 or LocalStorage) */
function getCached(key: string): string | null {
    const now = Date.now();
    const mem = memCache[key];
    if (mem && now - mem.timestamp < CACHE_TTL) return mem.value;

    if (isBrowser) {
        try {
            const lsRaw = localStorage.getItem(CACHE_KEY_PREFIX + key);
            if (lsRaw) {
                const parsed = JSON.parse(lsRaw);
                if (now - parsed.timestamp < CACHE_TTL) {
                    return parsed.value;
                }
            }
        } catch { }
    }
    return null;
}

/** 캐시 저장 (메모리 및 LocalStorage) */
function setCached(key: string, value: string) {
    const now = Date.now();
    memCache[key] = { value, timestamp: now };
    if (isBrowser) {
        try {
            localStorage.setItem(
                CACHE_KEY_PREFIX + key,
                JSON.stringify({ value, timestamp: now })
            );
        } catch { }
    }
}

/** MyMemory API 호출 */
async function callMyMemory(text: string, to: string): Promise<string | null> {
    const truncated = text.length > 500 ? text.substring(0, 500) : text;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|${to}&de=animefinder@noreply.com`;

    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;

        const data = await res.json();
        const translated = data?.responseData?.translatedText as string | undefined;

        if (!translated || !KO_REGEX.test(translated)) return null;
        return translated;
    } catch {
        return null;
    }
}

export async function translateText(
    text: string | null | undefined,
    to: string = 'ko'
): Promise<string> {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText || cleanText.length < 3) return cleanText;

    if (KO_REGEX.test(cleanText)) return cleanText;

    const cacheKey = `${to}:${cleanText.substring(0, 120)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const translated = await callMyMemory(cleanText, to);
    if (translated) {
        setCached(cacheKey, translated);
        return translated;
    }

    console.warn(`[Translate] 번역 실패, 원본 반환: "${cleanText.substring(0, 50)}..."`);
    return cleanText;
}
