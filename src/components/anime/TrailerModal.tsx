'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play } from 'lucide-react';
import { getT } from '@/lib/t';

const t = getT('Detail');

interface TrailerModalProps {
    videoId: string;
    site: string;
    className?: string;
    children?: React.ReactNode;
}

export default function TrailerModal({ videoId, site, className, children }: TrailerModalProps) {
    if (site !== 'youtube') return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <button className={className || "flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50"}>
                        <Play className="h-5 w-5 fill-current" />
                        {t('watchTrailer')}
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black/90 border-none aspect-video">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="border-none"
                ></iframe>
            </DialogContent>
        </Dialog>
    );
}

