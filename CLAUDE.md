# ReadB Client — Frontend CLAUDE.md

## 프로젝트 정의
ReadB(리드비)는 1on1 미팅의 Honesty Gap을 AI로 수치화하는 B2B HR SaaS의 프론트엔드 클라이언트.

## 기술 스택
- React 18 + TypeScript 5
- Vite (빌드)
- Tailwind CSS + shadcn/ui (UI)
- Recharts (차트: Silent Risk Radar)
- react-wordcloud (Blocker Cloud)
- React Router v6 (라우팅)
- Axios (API 호출)
- Zustand (전역 상태: 인증 토큰, 유저 정보)
- Vercel (배포)

## 디렉토리 구조 + 담당자

```
src/
│
├── app/                         # [공유] 앱 진입점
│   ├── App.tsx                      ← 공유 (라우팅 정의는 FE1 주도)
│   ├── router.tsx                   ← FE1 전담
│   └── providers.tsx                ← FE2 초기 작성 (Theme, QueryClient 등)
│
├── components/                  # [FE2 전담 — 공용 컴포넌트 라이브러리]
│   ├── ui/                          ← FE2 전담 (shadcn/ui 커스텀)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Accordion.tsx
│   │   ├── Skeleton.tsx
│   │   └── Input.tsx
│   ├── charts/                      ← FE2 전담
│   │   ├── ScatterRadar.tsx             (Silent Risk Radar)
│   │   ├── BlockerCloud.tsx             (Blocker Cloud 워드클라우드)
│   │   └── GapScoreGauge.tsx            (Gap Score 시각화)
│   ├── feedback/                    ← FE2 전담
│   │   ├── FeedbackCard.tsx             (피드백 카드 아코디언)
│   │   └── FeedbackCardList.tsx
│   ├── loading/                     ← FE2 전담
│   │   ├── AnalysisLoading.tsx          (위트 있는 로딩 UX)
│   │   └── loadingCopies.ts             (리더/멤버별 카피라이팅 데이터)
│   └── layout/                      ← FE2 전담
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── PageLayout.tsx
│
├── pages/                       # [FE1 전담 — 페이지 단위 화면]
│   ├── auth/                        ← FE1 전담
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── leader/                      ← FE1 전담
│   │   ├── LeaderDashboard.tsx          (Radar + Cloud + 요약)
│   │   ├── MeetingDetailPage.tsx        (녹음 + 분석 결과)
│   │   └── PromiseLedgerPage.tsx        (약속 장부)
│   └── member/                      ← FE1 전담
│       ├── MemberDashboard.tsx          (Career Memory 타임라인)
│       ├── MeetingFeedbackPage.tsx      (코칭 피드백 카드)
│       └── SurveyPage.tsx               (사전 서베이 폼)
│
├── features/                    # [페이지 안에서 쓰는 도메인별 로직]
│   ├── auth/                        ← FE1 전담
│   │   ├── useLogin.ts
│   │   └── useSignup.ts
│   ├── meeting/                     ← FE1 전담
│   │   ├── useRecorder.ts               (MediaRecorder 훅)
│   │   ├── useUploadRecording.ts
│   │   ├── useMeetingStatus.ts          (폴링 훅)
│   │   └── useAnalysisResult.ts
│   ├── leader/                      ← FE1 전담
│   │   ├── useRadarData.ts
│   │   ├── useBlockerData.ts
│   │   └── usePromises.ts
│   ├── member/                      ← FE1 전담
│   │   ├── useCareerMemory.ts
│   │   ├── useFeedbackCards.ts
│   │   └── useSurvey.ts
│   └── common/                      ← 공유 (추가만, 기존 수정 금지)
│       └── useAuth.ts
│
├── api/                         # [공유 — 규칙 엄수]
│   ├── client.ts                    ← FE2 초기 작성 (Axios 인스턴스 + 인터셉터)
│   ├── auth.api.ts                  ← FE1
│   ├── meeting.api.ts               ← FE1
│   ├── survey.api.ts                ← FE1
│   ├── analysis.api.ts              ← FE1
│   └── types.ts                     ← 공유 (API 응답 타입, 추가만 허용)
│
├── stores/                      # [FE2 초기 작성, 이후 공유]
│   └── authStore.ts                 ← FE2 초기, 이후 수정 시 합의
│
├── styles/                      # [FE2 전담]
│   └── globals.css
│
├── constants/                   # [공유 — 추가만, 기존 수정 금지]
│   └── routes.ts                    (라우트 경로 상수)
│
└── types/                       # [공유 — 추가만, 기존 수정 금지]
    ├── user.ts
    ├── meeting.ts
    ├── analysis.ts
    └── promise.ts
```

## 팀 역할 요약

### FE1 (페이지 + 비즈니스 로직)
- 담당: 모든 pages/*, features/*, api/ 함수, 라우팅
- 핵심 업무: 로그인/회원가입 흐름, 녹음 화면(MediaRecorder), 리더/멤버 대시보드, 분석 결과 화면, 서베이 폼
- 작업 원칙: components/에 있는 것을 가져다 쓰기만 함. 직접 만들지 않음. 필요한 공용 컴포넌트가 있으면 FE2에게 요청.

### FE2 (디자인 시스템 + 데이터 시각화)
- 담당: components/*, stores/*, styles/*, 초기 설정(providers, client)
- 핵심 업무: shadcn/ui 커스텀, 차트(ScatterRadar, BlockerCloud), 피드백 카드 아코디언, 로딩 UX, 레이아웃 셸
- 작업 원칙: pages/에 있는 파일은 절대 수정하지 않음. 컴포넌트는 props로 데이터를 받아서 렌더링만. 데이터 페칭 로직은 넣지 않음.

## 충돌 방지 규칙

1. **절대 경계선**: FE1은 components/ 폴더 안의 파일을 수정하지 않는다. FE2는 pages/ 폴더 안의 파일을 수정하지 않는다. 이것만 지키면 충돌 확률 90% 제거.

2. **컴포넌트 ↔ 페이지 소통은 Props로만**: FE2가 만든 컴포넌트는 반드시 Props 인터페이스를 export. FE1은 그 Props에 맞춰 데이터를 주입. 컴포넌트 내부에서 API를 직접 호출하지 않음.

   ```typescript
   // FE2가 만듦 (components/charts/ScatterRadar.tsx)
   interface ScatterRadarProps {
     data: { memberId: string; name: string; surfaceScore: number; inferredScore: number }[];
     onMemberClick?: (memberId: string) => void;
   }
   export default function ScatterRadar({ data, onMemberClick }: ScatterRadarProps) { ... }

   // FE1이 사용 (pages/leader/LeaderDashboard.tsx)
   const { data } = useRadarData(teamId);
   return <ScatterRadar data={data} onMemberClick={handleClick} />;
   ```

3. **types/ 와 constants/ 추가 규칙**: 새 타입/상수 추가는 자유. 기존 타입의 필드 이름 변경이나 삭제는 슬랙/디코 공유 후.

4. **api/types.ts 규칙**: BE API 응답 타입을 여기에 정의. BE에서 API 스펙이 바뀌면 FE1이 이 파일 업데이트 → FE2는 pull 받아서 컴포넌트 Props에 반영.

5. **브랜치 네이밍**: `feat/fe1-recording-page`, `feat/fe2-scatter-radar` — 접두사로 담당자 구분.

6. **공용 파일 수정 시**: App.tsx, api/client.ts, stores/authStore.ts, types/ 수정이 필요하면 반드시 상대방에게 먼저 알리고, 해당 PR을 먼저 머지한 뒤 상대방이 rebase.

## 라우팅 구조

```typescript
// FE1이 관리 (app/router.tsx)
const routes = [
  { path: '/login',                    element: <LoginPage /> },
  { path: '/signup',                   element: <SignupPage /> },
  { path: '/leader/dashboard',         element: <LeaderDashboard /> },
  { path: '/leader/meeting/:meetingId', element: <MeetingDetailPage /> },
  { path: '/leader/promises',          element: <PromiseLedgerPage /> },
  { path: '/member/dashboard',         element: <MemberDashboard /> },
  { path: '/member/meeting/:meetingId', element: <MeetingFeedbackPage /> },
  { path: '/member/survey/:meetingId', element: <SurveyPage /> },
];
```

## 컴포넌트 개발 순서 (FE2 참고)

```
Week 1: Button, Card, Badge, Input, Modal, Skeleton, PageLayout, Sidebar, Header
         → FE1이 페이지 뼈대 잡을 때 바로 쓸 수 있도록

Week 2: Accordion (피드백 카드용), AnalysisLoading (위트 로딩 UX)
         ScatterRadar, BlockerCloud, GapScoreGauge
         → FE1이 결과 화면 만들 때 꽂아 쓸 수 있도록

Week 3~4: 폴리싱, 반응형, 애니메이션, 엣지 케이스 처리
```

## 로딩 UX 카피 구조 (FE2 참고)

```typescript
// components/loading/loadingCopies.ts
export const loadingSteps = [
  { step: 1, label: '대화를 텍스트로 바꾸는 중', icon: '🎧' },
  { step: 2, label: '행간의 의미를 읽는 중', icon: '🔍' },
  { step: 3, label: '숫자로 정리하는 중', icon: '📊' },
  { step: 4, label: '피드백을 다듬는 중', icon: '💡' },
];

export const witCopies = {
  leader: [
    '팀원이 "괜찮다"고 했을 때, 진짜 괜찮은 건지 확인 중...',
    '숨은 블로커를 워드클라우드에 올리는 중...',
    '리더십 점수를 깎지 않게 조심하는 중...',
  ],
  member: [
    '리더가 놓친 당신의 강점을 찾고 있어요...',
    '커리어 메모리에 오늘의 성장을 기록하는 중...',
    '다음 미팅에서 쓸 한마디를 고르는 중...',
  ],
};
```

## 개발 명령어
```bash
npm run dev          # 로컬 개발 서버 (Vite, http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 로컬 미리보기
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## 주의사항
- MediaRecorder mimeType: `audio/webm;codecs=opus` 사용 (압축률 우수, 브라우저 호환성 좋음)
- 녹음 Blob은 FormData로 전송: `Content-Type: multipart/form-data`
- 분석 폴링 간격: 3초 (`useMeetingStatus` 훅에서 setInterval 3000ms)
- 폴링 타임아웃: 3분 초과 시 에러 화면 표시
- shadcn/ui 컴포넌트 수정 시 원본 유지하고 래퍼로 감쌀 것 (업데이트 대비)
