# ReadB Client — Frontend CLAUDE.md

## Project Definition
ReadB is a frontend client for a B2B HR SaaS that quantifies the Honesty Gap in 1-on-1 meetings using AI.

## Tech Stack
- React 18 + TypeScript 5
- Vite (build)
- Tailwind CSS + shadcn/ui (UI)
- Recharts (charts: Silent Risk Radar)
- react-wordcloud (Blocker Cloud)
- React Router v6 (routing)
- Axios (API calls)
- Zustand (global state: auth tokens, user info)
- Vercel (deployment)

## Directory Structure + Ownership

```
src/
│
├── app/                         # [Shared] App entry point
│   ├── App.tsx                      ← Shared (routing definitions led by FE1)
│   ├── router.tsx                   ← FE1 only
│   └── providers.tsx                ← FE2 initial setup (Theme, QueryClient, etc.)
│
├── components/                  # [FE2 only — Shared component library]
│   ├── ui/                          ← FE2 only (shadcn/ui customization)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Accordion.tsx
│   │   ├── Skeleton.tsx
│   │   └── Input.tsx
│   ├── charts/                      ← FE2 only
│   │   ├── ScatterRadar.tsx             (Silent Risk Radar)
│   │   ├── BlockerCloud.tsx             (Blocker Cloud word cloud)
│   │   └── GapScoreGauge.tsx            (Gap Score visualization)
│   ├── feedback/                    ← FE2 only
│   │   ├── FeedbackCard.tsx             (Feedback card accordion)
│   │   └── FeedbackCardList.tsx
│   ├── loading/                     ← FE2 only
│   │   ├── AnalysisLoading.tsx          (Witty loading UX)
│   │   └── loadingCopies.ts             (Leader/member copywriting data)
│   └── layout/                      ← FE2 only
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── PageLayout.tsx
│
├── pages/                       # [FE1 only — Page-level screens]
│   ├── auth/                        ← FE1 only
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── leader/                      ← FE1 only
│   │   ├── LeaderDashboard.tsx          (Radar + Cloud + Summary)
│   │   ├── MeetingDetailPage.tsx        (Recording + Analysis results)
│   │   └── PromiseLedgerPage.tsx        (Promise ledger)
│   └── member/                      ← FE1 only
│       ├── MemberDashboard.tsx          (Career Memory timeline)
│       ├── MeetingFeedbackPage.tsx      (Coaching feedback cards)
│       └── SurveyPage.tsx               (Pre-meeting survey form)
│
├── features/                    # [Domain-specific logic used within pages]
│   ├── auth/                        ← FE1 only
│   │   ├── useLogin.ts
│   │   └── useSignup.ts
│   ├── meeting/                     ← FE1 only
│   │   ├── useRecorder.ts               (MediaRecorder hook)
│   │   ├── useUploadRecording.ts
│   │   ├── useMeetingStatus.ts          (Polling hook)
│   │   └── useAnalysisResult.ts
│   ├── leader/                      ← FE1 only
│   │   ├── useRadarData.ts
│   │   ├── useBlockerData.ts
│   │   └── usePromises.ts
│   ├── member/                      ← FE1 only
│   │   ├── useCareerMemory.ts
│   │   ├── useFeedbackCards.ts
│   │   └── useSurvey.ts
│   └── common/                      ← Shared (additions only, no modifications to existing code)
│       └── useAuth.ts
│
├── api/                         # [Shared — Strict rules apply]
│   ├── client.ts                    ← FE2 initial setup (Axios instance + interceptors)
│   ├── auth.api.ts                  ← FE1
│   ├── meeting.api.ts               ← FE1
│   ├── survey.api.ts                ← FE1
│   ├── analysis.api.ts              ← FE1
│   └── types.ts                     ← Shared (API response types, additions only)
│
├── stores/                      # [FE2 initial setup, shared afterwards]
│   └── authStore.ts                 ← FE2 initial, modifications require mutual agreement
│
├── styles/                      # [FE2 only]
│   └── globals.css
│
├── constants/                   # [Shared — Additions only, no modifications to existing code]
│   └── routes.ts                    (Route path constants)
│
└── types/                       # [Shared — Additions only, no modifications to existing code]
    ├── user.ts
    ├── meeting.ts
    ├── analysis.ts
    └── promise.ts
```

## Team Role Summary

### FE1 (Pages + Business Logic)
- Ownership: All pages/*, features/*, api/ functions, routing
- Core responsibilities: Login/signup flow, recording screen (MediaRecorder), leader/member dashboards, analysis result screens, survey forms
- Working principle: Only imports and uses components from components/. Never creates them directly. Requests FE2 for any needed shared components.

### FE2 (Design System + Data Visualization)
- Ownership: components/*, stores/*, styles/*, initial setup (providers, client)
- Core responsibilities: shadcn/ui customization, charts (ScatterRadar, BlockerCloud), feedback card accordion, loading UX, layout shell
- Working principle: Never modifies files in pages/. Components receive data via props and only render. No data-fetching logic inside components.

## Conflict Prevention Rules

1. **Absolute Boundary**: FE1 must not modify files inside the components/ folder. FE2 must not modify files inside the pages/ folder. Following this single rule eliminates 90% of conflicts.

2. **Component ↔ Page Communication via Props Only**: Components built by FE2 must export a Props interface. FE1 injects data according to those Props. Components must not call APIs directly.

   ```typescript
   // Built by FE2 (components/charts/ScatterRadar.tsx)
   interface ScatterRadarProps {
     data: { memberId: string; name: string; surfaceScore: number; inferredScore: number }[];
     onMemberClick?: (memberId: string) => void;
   }
   export default function ScatterRadar({ data, onMemberClick }: ScatterRadarProps) { ... }

   // Used by FE1 (pages/leader/LeaderDashboard.tsx)
   const { data } = useRadarData(teamId);
   return <ScatterRadar data={data} onMemberClick={handleClick} />;
   ```

3. **types/ and constants/ Addition Rules**: Adding new types/constants is free. Renaming or deleting fields of existing types requires notification via Slack/Discord first.

4. **api/types.ts Rules**: BE API response types are defined here. When BE API specs change, FE1 updates this file → FE2 pulls and reflects changes in component Props.

5. **Branch Naming**: `feat/fe1-recording-page`, `feat/fe2-scatter-radar` — prefix indicates ownership.

6. **Shared File Modifications**: When changes to App.tsx, api/client.ts, stores/authStore.ts, or types/ are needed, always notify the other party first, merge that PR first, then the other party rebases.

## Routing Structure

```typescript
// Managed by FE1 (app/router.tsx)
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

## Component Development Order (FE2 Reference)

```
Week 1: Button, Card, Badge, Input, Modal, Skeleton, PageLayout, Sidebar, Header
         → Ready for FE1 to scaffold page structures immediately

Week 2: Accordion (for feedback cards), AnalysisLoading (witty loading UX)
         ScatterRadar, BlockerCloud, GapScoreGauge
         → Ready for FE1 to plug into result screens

Week 3~4: Polishing, responsive design, animations, edge case handling
```

## Loading UX Copy Structure (FE2 Reference)

```typescript
// components/loading/loadingCopies.ts
export const loadingSteps = [
  { step: 1, label: 'Converting conversation to text', icon: '🎧' },
  { step: 2, label: 'Reading between the lines', icon: '🔍' },
  { step: 3, label: 'Crunching the numbers', icon: '📊' },
  { step: 4, label: 'Polishing the feedback', icon: '💡' },
];

export const witCopies = {
  leader: [
    'Checking if "I\'m fine" really means fine...',
    'Surfacing hidden blockers onto the word cloud...',
    'Being careful not to ding your leadership score...',
  ],
  member: [
    'Finding strengths your leader might have missed...',
    'Recording today\'s growth in your Career Memory...',
    'Picking the perfect one-liner for your next meeting...',
  ],
};
```

## Development Commands
```bash
npm run dev          # Local dev server (Vite, http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview build output locally
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Important Notes
- MediaRecorder mimeType: Use `audio/webm;codecs=opus` (excellent compression, good browser compatibility)
- Recording Blob is sent via FormData: `Content-Type: multipart/form-data`
- Analysis polling interval: 3 seconds (`useMeetingStatus` hook with setInterval 3000ms)
- Polling timeout: Show error screen if exceeding 3 minutes
- When modifying shadcn/ui components, preserve the original and wrap with a wrapper component (for update compatibility)
