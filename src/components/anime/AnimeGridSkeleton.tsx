import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="aspect-[3/4] rounded-xl overflow-hidden border-none bg-secondary/20">
                    <Skeleton className="w-full h-full" />
                </Card>
            ))}
        </div>
    );
}
