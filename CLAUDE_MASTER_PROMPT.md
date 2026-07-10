# Anime Finder — 마스터 프롬프트

## 프로젝트 개요

한국어 애니메이션 탐색 웹앱. AniList GraphQL API로 애니 데이터를 가져오고, TMDB API + Google Translate로 제목·줄거리를 한국어 번역해 제공한다.
Cafe24 호스팅에 정적 파일로 배포(`/animefinder` 경로).

---

## 기술 스택

| 항목 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, `output: 'export'` 정적 빌드) |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (radix-ui 기반) |
| 애니메이션 | Framer Motion |
| 캐러셀 | Swiper |
| 서버 상태 | TanStack React Query v5 |
| 국제화 | next-intl (한국어 고정 사용) |
| 데이터 소스 | AniList GraphQL API (무인증, rate-limit 대응) |
| 번역 | TMDB API (한국어 제목/줄거리) → 실패 시 Google Translate 백업 |
| 배포 | Cafe24 FTP 업로드 (GitHub Actions) |

---

## 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx            # 홈 (트렌딩·최고평점·기대작 캐러셀)
│   ├── layout.tsx
│   ├── globals.css
│   ├── anime/page.tsx      # 애니 상세 (트레일러·캐릭터·추천작)
│   └── search/
│       ├── page.tsx        # 검색·필터 결과 (클라이언트 렌더링)
│       └── loading.tsx
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx     # 히어로 배너 (배경 이미지 + 제목·설명)
│   │   └── AnimeCarousel.tsx   # Swiper 캐러셀
│   ├── anime/
│   │   ├── AnimeCard.tsx       # 카드 (포스터·평점·상태 배지)
│   │   ├── AnimeGridSkeleton.tsx
│   │   └── TrailerModal.tsx    # YouTube 트레일러 모달
│   ├── layout/
│   │   └── Navbar.tsx          # 검색바 포함 상단 네비게이션
│   ├── search/
│   │   └── FilterSidebar.tsx   # 장르·포맷·연도·상태·평점 필터
│   ├── ui/
│   │   ├── DonationPopup.tsx
│   │   └── (shadcn 컴포넌트들)
│   └── providers.tsx           # React Query Provider
├── lib/
│   ├── api.ts          # AniList GraphQL 호출 (캐시·재시도 포함)
│   ├── tmdb.ts         # TMDB 한국어 제목/줄거리 조회
│   ├── translator.ts   # Google Translate 백업 번역
│   ├── t.ts            # next-intl 클라이언트 번역 헬퍼
│   ├── i18n-keys.ts
│   ├── mock-data.ts
│   └── utils.ts
├── i18n/request.ts
└── navigation.ts
```

---

## 핵심 데이터 플로우

### 홈 페이지 (SSG, revalidate 3600)
```
page.tsx (서버)
  ├── AniList API → getTrendingAnime / getTopRatedAnime / getUpcomingAnime
  └── 각 애니마다 translateAnimeData()
        ├── getTmdbKoreanData(romaji, native) → TMDB 한국어 제목
        └── 실패 시 translateText(title, 'ko') → Google Translate
```

### 검색 페이지 (클라이언트 렌더링)
```
URL searchParams → useQuery
  └── searchAnime(page, 24, q, genre, year, format, status, score)
        └── AniList GraphQL 검색 쿼리
              → 결과 리스트에 translateAnimeData() 적용
```

---

## AniList API 주요 쿼리

```typescript
// 필드 공통 패턴
media {
  id
  title { romaji english native }
  description
  coverImage { large extraLarge }
  bannerImage
  genres
  status          // FINISHED | RELEASING | NOT_YET_RELEASED
  averageScore    // 0~100 (10으로 나누면 10점 만점)
  episodes
  studios(isMain: true) { nodes { name } }
}

// 검색 파라미터
media(
  search: $search,
  genre: $genre,           // "Action" | "Romance" 등
  seasonYear: $year,
  format: $format,         // TV | MOVIE | OVA | ONA | SPECIAL
  status: $status,
  averageScore_greater: $score,  // score * 10 - 1
  type: ANIME,
  sort: [POPULARITY_DESC]
)
```

---

## 번역 우선순위

1. **TMDB API** - `language=ko-KR`으로 검색, 한글 포함 여부(`/[\uAC00-\uD7A3]/`) 검증
2. **Google Translate** - TMDB 결과 없을 때 백업
3. **원본 타이틀** - 번역 실패 시 romaji → english → native 순

---

## 배포 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  basePath: '/animefinder',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

- `npm run build` → `out/` 디렉토리 생성
- GitHub Actions에서 `out/` → Cafe24 FTP 업로드
- 접속 URL: `https://bsjuuny2026.mycafe24.com/animefinder`

---

## 환경 변수

```env
NEXT_PUBLIC_TMDB_API_KEY=   # TMDB API 키 (v3)
# Google Translate는 별도 키 없이 무료 엔드포인트 사용 중
```

---

## 검색 필터 옵션

| 필터 | 선택지 |
|---|---|
| 장르 | Action, Adventure, Comedy, Drama, Fantasy, Horror, Mecha, Psychological, Romance, Sci-Fi, Slice of Life, Sports, Thriller |
| 포맷 | TV, MOVIE, OVA, ONA, SPECIAL |
| 연도 | 현재 연도+1 ~ 30년 전 |
| 상태 | FINISHED, RELEASING, NOT_YET_RELEASED |
| 최소 평점 | 0~10 (슬라이더) |

---

## 주요 UI 특징

- **다크 테마** 고정 (배경: `bg-background`, 텍스트: `text-foreground`)
- **AnimeCard**: `aspect-[3/4]` 포스터, hover 시 scale + Play 버튼 오버레이
- **HeroSection**: `80vh` 배너, 좌측 그라디언트 오버레이, Framer Motion 진입 애니메이션
- **AnimeCarousel**: Swiper breakpoint (2~6개 표시), hydration mismatch 방지를 위한 `mounted` 상태 처리
- **페이지네이션**: searchParams 기반, 이전/다음 버튼 비활성화 처리

---

## 추가 개발 시 주의사항

- AniList API rate limit: 429 응답 시 지수 백오프 재시도 (최대 5회)
- `output: 'export'` 정적 빌드이므로 서버 사이드 런타임 API 사용 불가
- 클라이언트 번역(`translateAnimeData`)은 검색 결과가 많을 경우 API 호출 수 주의
- TMDB 인메모리 캐시는 빌드 간 공유되지 않음 (Next.js 서버 재시작 시 초기화)
- `referrerPolicy="no-referrer"` 필수 (AniList CDN 이미지 로드에 필요)
