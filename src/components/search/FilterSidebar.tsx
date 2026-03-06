'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';

const genres = ['ALL', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'];
const formats = ['ALL', 'TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'];
const statuses = ['ALL', 'FINISHED', 'RELEASING', 'NOT_YET_RELEASED'];
const currentYear = new Date().getFullYear();
const years = ['ALL', ...Array.from({ length: 30 }, (_, i) => currentYear + 1 - i).map(String)];

function SidebarContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 'ALL' || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            params.set('page', '1');
            router.push(`/search?${params.toString()}`);
        },
        [router, searchParams]
    );

    const getVal = (key: string) => searchParams.get(key) || 'ALL';

    return (
        <div className="flex flex-col gap-6 sticky top-24">
            <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">장르</h3>
                <select
                    value={getVal('genre')}
                    onChange={(e) => updateParam('genre', e.target.value)}
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                    {genres.map(g => <option key={g} value={g} className="bg-black text-white">{g}</option>)}
                </select>
            </div>

            <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">포맷</h3>
                <select
                    value={getVal('format')}
                    onChange={(e) => updateParam('format', e.target.value)}
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                    {formats.map(f => <option key={f} value={f} className="bg-black text-white">{f.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">연도</h3>
                <select
                    value={getVal('year')}
                    onChange={(e) => updateParam('year', e.target.value)}
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                    {years.map(y => <option key={y} value={y} className="bg-black text-white">{y}</option>)}
                </select>
            </div>

            <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">상태</h3>
                <select
                    value={getVal('status')}
                    onChange={(e) => updateParam('status', e.target.value)}
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                    {statuses.map(s => <option key={s} value={s} className="bg-black text-white">{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">최소 평점 (0-10)</h3>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0" max="10" step="1"
                        value={getVal('score') === 'ALL' ? '0' : getVal('score')}
                        onChange={(e) => updateParam('score', e.target.value === '0' ? 'ALL' : e.target.value)}
                        className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-bold w-4 text-center">
                        {getVal('score') === 'ALL' ? '0' : getVal('score')}
                    </span>
                </div>
            </div>

            <button
                onClick={() => router.push('/search')}
                className="w-full py-2 mt-4 text-sm font-bold bg-white/5 hover:bg-destructive/80 hover:text-white rounded-lg transition-colors border border-white/10"
            >
                필터 초기화
            </button>
        </div>
    );
}

export default function FilterSidebar() {
    return (
        <Suspense fallback={<div className="text-muted-foreground text-sm">필터 불러오는 중...</div>}>
            <SidebarContent />
        </Suspense>
    );
}
