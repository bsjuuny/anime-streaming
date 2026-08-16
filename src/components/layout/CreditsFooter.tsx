export default function CreditsFooter() {
    return (
        <footer className="border-t border-white/10 bg-black/40 px-6 py-10 text-sm text-white/60">
            <div className="container mx-auto flex max-w-6xl flex-col gap-5">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="font-semibold text-white/80">Data &amp; credits</span>
                    <a
                        href="https://anilist.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                    >
                        Anime data: AniList
                    </a>
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TMDB 홈페이지"
                        className="inline-flex items-center"
                    >
                        <img
                            src="/animefinder/tmdb-logo.svg"
                            alt="TMDB"
                            className="h-5 w-auto"
                        />
                    </a>
                </div>
                <p className="max-w-4xl leading-relaxed">
                    애니메이션 기본 정보와 이미지는 AniList를 사용하며, 일부 한국어 제목과 줄거리는 TMDB 데이터를 사용합니다.
                    각 데이터의 갱신 시점과 원문 내용은 제공처에서 확인해 주세요.
                </p>
                <p className="max-w-4xl text-xs leading-relaxed text-white/45">
                    This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
            </div>
        </footer>
    );
}
