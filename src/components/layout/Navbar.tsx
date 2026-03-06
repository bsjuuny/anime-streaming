'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, Globe } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-tighter">
                        애니파인더
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-medium">
                    <Link href="/" className="text-foreground hover:text-primary transition-colors">홈</Link>
                    <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors">탐색</Link>
                    <Link href="/search?status=RELEASING" className="text-muted-foreground hover:text-primary transition-colors">인기</Link>
                    <Link href="/search?status=NOT_YET_RELEASED" className="text-muted-foreground hover:text-primary transition-colors">예정</Link>
                </nav>

                {/* Search & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <form
                        className="relative hidden md:block group"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const q = formData.get('q');
                            if (q) {
                                window.location.href = `/animefinder/search?q=${encodeURIComponent(q.toString())}`;
                            }
                        }}
                    >
                        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white'}`}>
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            name="q"
                            placeholder="애니메이션 검색..."
                            className={`pl-10 pr-4 py-2 rounded-full text-sm outline-none transition-all w-48 focus:w-64 focus:ring-2 focus:ring-primary/50 ${isScrolled
                                ? 'bg-secondary/50 border border-border text-foreground hover:bg-secondary/80'
                                : 'bg-black/20 border border-white/20 text-white placeholder-white/70 hover:bg-black/40 backdrop-blur-sm'
                                }`}
                        />
                    </form>

                    <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                    {mobileOpen && (
                        <div className="md:hidden absolute top-full left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border py-4">
                            <nav className="flex flex-col items-center gap-4">
                                <Link href="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>홈</Link>
                                <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>탐색</Link>
                                <Link href="/search?status=RELEASING" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>인기</Link>
                                <Link href="/search?status=NOT_YET_RELEASED" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>예정</Link>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
