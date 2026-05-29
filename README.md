# ReadB 클라이언트 — 프론트엔드

## 프로젝트 소개

ReadB는 AI를 활용해 1:1 미팅의 "정직성 갭(Honesty Gap)"을 정량화하는 B2B HR SaaS 프론트엔드입니다.

## 기술 스택

- React 18 + TypeScript 5
- Vite (빌드)
- Tailwind CSS + shadcn/ui (UI)
- Recharts (차트: Silent Risk Radar)
- react-wordcloud (Blocker Cloud)
- React Router v6 (라우팅)
- Axios (API 통신)
- Zustand (전역 상태: 인증 토큰, 유저 정보)
- Vercel (배포)

## 디렉토리 구조 및 소유권

```
src/
│
├── app/                         # [공용] 앱 진입점
│   ├── App.tsx                      ← 공용 (라우팅 정의는 FE1 주도)
│   ├── router.tsx                   ← FE1 전담
│   └── providers.tsx                ← FE2 초기 설정 (Theme, QueryClient 등)
│
├── components/                  # [FE2 전담 — 공용 컴포넌트 라이브러리]
│   ├── ui/                          ← FE2 전담 (shadcn/ui 커스터마이징)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Accordion.tsx
│   │   ├── Skeleton.tsx
│   │   └── Input.tsx
│   ├── charts/                      ← FE2 전담
│   │   ├── ScatterRadar.tsx             (Silent Risk Radar)
│   │   ├── BlockerCloud.tsx             (Blocker Cloud 워드 클라우드)
│   │   └── GapScoreGauge.tsx            (Gap Score 시각화)
│   ├── feedback/                    ← FE2 전담
│   │   ├── FeedbackCard.tsx             (피드백 카드 아코디언)
│   │   └── FeedbackCardList.tsx
│   ├── loading/                     ← FE2 전담
│   │   ├── AnalysisLoading.tsx          (위트 있는 로딩 UX)
│   │   └── loadingCopies.ts             (리더/멤버 로딩 카피 데이터)
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
│   │   ├── LeaderDashboard.tsx          (Radar + Cloud + Summary)
│   │   ├── MeetingDetailPage.tsx        (녹음 + 분석 결과)
│   │   └── PromiseLedgerPage.tsx        (약속 원장)
│   └── member/                      ← FE1 전담
│       ├── MemberDashboard.tsx          (커리어 메모리 타임라인)
│       ├── MeetingFeedbackPage.tsx      (코칭 피드백 카드)
│       └── SurveyPage.tsx               (사전 설문 폼)
│
├── features/                    # [페이지 내에서 사용되는 도메인별 로직]
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
│   └── common/                      ← 공용 (추가만 가능, 기존 코드 수정 금지)
│       └── useAuth.ts
│
├── api/                         # [공용 — 엄격한 규칙 적용]
│   ├── client.ts                    ← FE2 초기 설정 (Axios 인스턴스 + 인터셉터)
│   ├── auth.api.ts                  ← FE1
│   ├── meeting.api.ts               ← FE1
│   ├── survey.api.ts                ← FE1
│   ├── analysis.api.ts              ← FE1
│   └── types.ts                     ← 공용 (API 응답 타입, 추가만 가능)
│
├── stores/                      # [FE2 초기 설정, 이후 공용]
│   └── authStore.ts                 ← FE2 초기 설정, 수정 시 상호 협의 필요
│
├── styles/                      # [FE2 전담]
│   └── globals.css
│
├── constants/                   # [공용 — 추가만 가능, 기존 코드 수정 금지]
│   └── routes.ts                    (라우트 경로 상수)
│
└── types/                       # [공용 — 추가만 가능, 기존 코드 수정 금지]
    ├── user.ts
    ├── meeting.ts
    ├── analysis.ts
    └── promise.ts
```

## 팀 역할 요약

### FE1 (페이지 + 비즈니스 로직)

- 담당 영역: `pages/*`, `features/*`, `api/` 함수, 라우팅
- 핵심 책임: 로그인/회원가입 플로우, 녹음 화면(MediaRecorder), 리더/멤버 대시보드, 분석 결과 화면, 설문 폼
- 작업 원칙: `components/`의 컴포넌트를 임포트하여 사용만 합니다. 직접 생성하지 않습니다. 필요한 공용 컴포넌트는 FE2에 요청합니다.

### FE2 (디자인 시스템 + 데이터 시각화)

- 담당 영역: `components/*`, `stores/*`, `styles/*`, 초기 설정 (providers, client)
- 핵심 책임: shadcn/ui 커스터마이징, 차트(ScatterRadar, BlockerCloud), 피드백 카드 아코디언, 로딩 UX, 레이아웃 쉘
- 작업 원칙: `pages/` 내 파일을 수정하지 않습니다. 컴포넌트는 props로 데이터를 받아 렌더링만 합니다. 컴포넌트 내부에서 데이터 페칭 로직을 작성하지 않습니다.

## 충돌 방지 규칙

1. **절대적 경계**: FE1은 `components/` 폴더 내 파일을 수정해서는 안 됩니다. FE2는 `pages/` 폴더 내 파일을 수정해서는 안 됩니다. 이 규칙 하나만 지켜도 충돌의 90%가 예방됩니다.

2. **컴포넌트 ↔ 페이지 통신은 Props 전용**: FE2가 만든 컴포넌트는 Props 인터페이스를 export해야 합니다. FE1은 해당 Props에 맞게 데이터를 주입합니다. 컴포넌트는 API를 직접 호출하지 않습니다.

   ```typescript
   // FE2 작성 (components/charts/ScatterRadar.tsx)
   interface ScatterRadarProps {
     data: { memberId: string; name: string; surfaceScore: number; inferredScore: number }[];
     onMemberClick?: (memberId: string) => void;
   }
   export default function ScatterRadar({ data, onMemberClick }: ScatterRadarProps) { ... }

   // FE1 사용 (pages/leader/LeaderDashboard.tsx)
   const { data } = useRadarData(teamId);
   return <ScatterRadar data={data} onMemberClick={handleClick} />;
   ```

3. **`types/` 및 `constants/` 추가 규칙**: 새로운 타입/상수 추가는 자유롭게 가능합니다. 기존 타입의 필드 이름 변경이나 삭제는 Slack/Discord를 통해 먼저 공지해야 합니다.

4. **`api/types.ts` 규칙**: BE API 응답 타입은 이 파일에 정의합니다. BE API 스펙이 변경되면 FE1이 이 파일을 업데이트하고, FE2는 pull 후 컴포넌트 Props에 반영합니다.

5. **브랜치 네이밍**: `feat/fe1-recording-page`, `feat/fe2-scatter-radar` — 접두사로 소유권을 표시합니다.

6. **공용 파일 수정**: `App.tsx`, `api/client.ts`, `stores/authStore.ts`, `types/` 변경이 필요할 경우, 항상 상대방에게 먼저 공지하고, 해당 PR을 먼저 머지한 후 리베이스합니다.

## 라우팅 구조

```typescript
// FE1 관리 (app/router.tsx)
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
1주차: Button, Card, Badge, Input, Modal, Skeleton, PageLayout, Sidebar, Header
        → FE1이 즉시 페이지 구조 스캐폴딩 가능

2주차: Accordion (피드백 카드용), AnalysisLoading (위트 있는 로딩 UX)
        ScatterRadar, BlockerCloud, GapScoreGauge
        → FE1이 결과 화면에 연결 가능

3~4주차: 폴리싱, 반응형 디자인, 애니메이션, 엣지 케이스 처리
```

## 로딩 UX 카피 구조 (FE2 참고)

```typescript
// components/loading/loadingCopies.ts
export const loadingSteps = [
  { step: 1, label: '대화 내용을 텍스트로 변환하는 중', icon: '🎧' },
  { step: 2, label: '행간의 의미를 읽는 중', icon: '🔍' },
  { step: 3, label: '숫자를 분석하는 중', icon: '📊' },
  { step: 4, label: '피드백을 다듬는 중', icon: '💡' },
];

export const witCopies = {
  leader: [
    '"괜찮아요"가 진짜 괜찮은 건지 확인하는 중...',
    '숨겨진 블로커를 워드 클라우드에 올리는 중...',
    '리더십 점수에 영향이 없도록 조심하는 중...',
  ],
  member: [
    '리더가 놓쳤을 수 있는 강점을 찾는 중...',
    '오늘의 성장을 커리어 메모리에 기록하는 중...',
    '다음 미팅을 위한 완벽한 한 마디를 고르는 중...',
  ],
};
```

## 개발 명령어

```bash
npm run dev          # 로컬 개발 서버 (Vite, http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과물 로컬 미리보기
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## 주요 참고 사항

- MediaRecorder mimeType: `audio/webm;codecs=opus` 사용 (압축률 우수, 브라우저 호환성 양호)
- 녹음 Blob은 FormData로 전송: `Content-Type: multipart/form-data`
- 분석 폴링 간격: 3초 (`useMeetingStatus` 훅, setInterval 3000ms)
- 폴링 타임아웃: 3분 초과 시 에러 화면 표시
- shadcn/ui 컴포넌트 수정 시 원본을 보존하고 래퍼 컴포넌트로 감싸서 사용 (업데이트 호환성 유지)
