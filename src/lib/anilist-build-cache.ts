import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

// Server-only: never import this from a 'use client' file. src/lib/api.ts stays
// free of node:fs/node:crypto because it's also bundled for the browser (the
// client-side /anime and /search pages call it directly at runtime).
const CACHE_DIR = join(process.cwd(), '.anilist-cache');

function cacheFilePath(key: string): string {
  return join(CACHE_DIR, `${createHash('sha256').update(key).digest('hex')}.json`);
}

/**
 * output: 'export' means a failed build ships nothing - the scheduled deploy
 * (run-anime-finder.mjs) aborts and Cafe24 keeps serving whatever build last
 * succeeded. AniList has had multi-day outages before ("temporarily disabled
 * due to severe stability issues"), so a single failed fetch here falls back to
 * the last successful response on disk instead of failing the whole build -
 * stale trending/top-rated/upcoming lists beat a stalled deploy. The cache
 * lives outside git (see .gitignore) so it persists across scheduled runs on
 * this machine without ever being something `git pull` could touch or revert.
 */
export async function withBuildCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const data = await fetcher();
    try {
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cacheFilePath(key), JSON.stringify({ savedAt: new Date().toISOString(), data }), 'utf8');
    } catch {
      // Best-effort; a failed cache write must never fail the build.
    }
    return data;
  } catch (error) {
    let cached: { savedAt: string; data: T } | undefined;
    try {
      cached = JSON.parse(readFileSync(cacheFilePath(key), 'utf8'));
    } catch {
      cached = undefined;
    }
    if (!cached) throw error;
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[anilist-build-cache] "${key}" fetch failed (${message}); using cached data from ${cached.savedAt}`);
    return cached.data;
  }
}
