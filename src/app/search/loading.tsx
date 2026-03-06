import Navbar from '@/components/layout/Navbar';
import AnimeGridSkeleton from '@/components/anime/AnimeGridSkeleton';

export default function SearchLoading() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <Navbar />
            <div className="container mx-auto px-4 md:px-8 xl:px-12 flex flex-col md:flex-row gap-8 mt-2">
                {/* Placeholder for Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="h-[600px] w-full bg-secondary/20 rounded-2xl animate-pulse"></div>
                </aside>

                {/* Placeholder for Results Grid */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h1 className="text-2xl font-black text-white flex items-center gap-2">
                            Loading Anime...
                        </h1>
                        <div className="w-20 h-5 bg-secondary/50 rounded-lg animate-pulse"></div>
                    </div>

                    <AnimeGridSkeleton count={24} />
                </div>
            </div>
        </main>
    );
}
