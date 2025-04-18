# 🔤 Fluent-journey

자신만의 단어장을 만들고 단어를 등록하여 공부할 수 있는 웹 애플리케이션입니다. 다른 사용자들이 볼 수 있도록 단어장을 공유할 수 있습니다.

## 🔗 배포 링크

[Fluent Journey 바로가기](https://fluent-journey.vercel.app)

## 🚀 기능 소개

- 단어장 생성하기
- 단어장 공유 및 취소 하기
- 공유 단어장 조회
- 공유 단어장 좋아요 및 즐겨찾기
- 각 공유 단어장 사용자 댓글 등록
- 단어장 플래쉬 카드 테스트
- 로그인 및 사용자 프로필 조회

## 🛠 기술 스택

- Frontend: Next.js, React, Tailwind CSS

- Backend: Prisma, Next.js API Routes

- 인증: Auth.js (Kakao 로그인)

- 배포: Vercel

## 🚀 시작하기

```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm

# 저장소 클론
git clone https://github.com/Simon1476/fluent-journey.git

# 프로젝트 디렉토리로 이동
cd fluent-journey

# 의존성 설치
pnpm install

# 환경 변수 설정
 .env.example 파일을 복사하여 .env.local 파일 생성

# 개발 서버 실행
pnpm run dev
```

💡 환경 변수 설정은 .env.example 파일을 복사하여 .env.local 파일을 만들고 필요한 값들을 입력해주세요.

- [Auth-Secret 설정 가이드](https://authjs.dev/getting-started/installation)
- [카카오 환경변수 설정 가이드](https://tasty-meerkat-c0d.notion.site/Auth-js-191d4ecd0c1f80bda80ad231769678c3)
- [구글 환경변수 설정 가이드](https://tasty-meerkat-c0d.notion.site/Google-1ced4ecd0c1f80e8a1b2dc27f8d9da92)

## 📂 프로젝트 구조

```bash
src/
├── actions/
│ └── authActions.ts # 인증 관련 서버 액션
│
├── app/
│ ├── (auth)/
│ │ └── signin/
│ │ └── page.tsx # 로그인 페이지
│ ├── api/
│ │ ├── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts # NextAuth API 라우트
│ │ └── user-id/
│ │ └── route.ts # 사용자 ID API
│ ├── create-set/
│ │ └── page.tsx # 단어장 생성 페이지
│ ├── profile/
│ │ └── page.tsx # 프로필 페이지
│ ├── shared/
│ │ └── lists/
│ │ ├── [id]/
│ │ │ └── page.tsx # 공유 단어장 상세 페이지
│ │ └── page.tsx # 공유 단어장 목록 페이지
│ ├── word/
│ │ ├── lists/
│ │ │ ├── [id]/
│ │ │ │ └── page.tsx # 단어장 상세 페이지
│ │ │ └── page.tsx # 단어장 목록 페이지
│ │ └── page.tsx # 단어 학습 페이지
│ ├── globals.css # 전역 스타일
│ ├── layout.tsx # 루트 레이아웃
│ └── page.tsx # 홈페이지
│
├── components/
│ ├── ui/ # ShadCN UI 컴포넌트
│ │ ├── alert-dialog.tsx
│ │ ├── avatar.tsx
│ │ ├── badge.tsx
│ │ ├── button.tsx
│ │ └── ...
│ ├── layout/ # 레이아웃 컴포넌트
│ │ └── navbar/
│ │ └── navbar.tsx # 네비게이션 바
│ ├── CustomPagination.tsx # 커스텀 페이지네이션
│ ├── Flashcards.tsx # 플래시카드 컴포넌트
│ └── pagination-with-links.tsx # 링크 페이지네이션
│
├── features/ # 기능별 모듈화
│ ├── profile/
│ │ ├── components/
│ │ └── server/
│ │ └── db/
│ ├── shared-wordlists/
│ │ ├── components/
│ │ └── server/
│ │ ├── actions/
│ │ └── db/
│ └── wordlists/
│  ├── components/
│  └── server/
│  └── db/
│
├── lib/ # 유틸리티 함수
│ ├── prisma.ts
│ └── utils.ts
│
├── types/ # 타입 정의
│ ├── googleProfile.ts
│ └── kakaoProfile.ts
│
└── auth.ts # 인증 설정
```

## ✨ 주요 기능

단어장 생성 - 단어 뜻과 예문(선택사항)을 등록 가능, 단어 음성 듣기 가능

공유 단어장 검색 - 단어장 제목, 태그 및 즐겨찾기 여부로 검색

사용자 프로필 - 사용자가 공유한 단어장, 사용자 단어장, 즐겨찾기한 단어장 조회 가능

### 단어장 생성

![Image](https://github.com/user-attachments/assets/6da47df1-b75c-44e5-bcd4-86d537420a74)

### 단어장 공유

![Image](https://github.com/user-attachments/assets/22478216-1bb9-4ddc-9678-fb378114543f)

### 공유 단어장 검색(키워드, 태그, 즐겨찾기)

![Image](https://github.com/user-attachments/assets/7d2db55c-3922-4141-a1ea-edb54aae3b72)

### 단어 테스트

![Image](https://github.com/user-attachments/assets/7d6e4619-b422-4735-8189-97a1e3f714e6)

### 사용자 프로필

![Image](https://github.com/user-attachments/assets/592557f3-4fe7-45cc-9696-da7a3a97ba4e)
