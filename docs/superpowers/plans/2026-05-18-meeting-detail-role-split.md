# 미팅 상세 페이지 역할 분리 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 리더/멤버 전용 미팅 상세 페이지를 분리하고, 백엔드 단건 조회 API를 연동한다.

**Architecture:** `useMeetingDetail` 훅이 `GET /api/v1/meetings/:meetingId`를 호출해 두 페이지에 공유된다. 리더 페이지는 기존 녹음 플로우를 로컬 상태로 관리하고, 멤버 페이지는 `SurveyForm` 컴포넌트를 임베드한다. `SurveyPage`는 `SurveyForm`의 래퍼로만 남아 기존 라우트를 유지한다.

**Tech Stack:** React, TypeScript, Axios (`api/client.ts`), Zustand, React Router v6, Tailwind CSS

> **참고:** 이 프로젝트에는 테스트 프레임워크가 설정되어 있지 않아 TDD 단계는 생략한다. 각 태스크 완료 후 `npm run dev` 서버에서 브라우저로 직접 확인한다. 타입 오류는 `npm run type-check`로 검증한다.

---

## 파일 맵

| 작업 | 파일 | 설명 |
|------|------|------|
| 생성 | `src/api/meetings.ts` | `fetchMeetingDetail` API 함수 |
| 생성 | `src/features/meeting/useMeetingDetail.ts` | 단건 조회 훅 |
| 생성 | `src/components/survey/SurveyForm.tsx` | 설문 폼 컴포넌트 (SurveyPage에서 추출) |
| 수정 | `src/pages/member/SurveyPage.tsx` | SurveyForm 래퍼로 교체 |
| 수정 | `src/types/meeting.ts` | `MeetingDetail` 타입 추가 |
| 수정 | `src/pages/leader/MeetingDetailPage.tsx` | useMeetingDetail 연동, 로컬 상태로 리팩토링 |
| 생성 | `src/pages/member/MeetingDetailPage.tsx` | SurveyForm 임베드 멤버 페이지 |
| 수정 | `src/app/router.tsx` | 멤버 라우트 교체 |

---

## Task 1: MeetingDetail 타입 추가

**Files:**
- Modify: `src/types/meeting.ts`

- [ ] **Step 1: `MeetingDetail` 인터페이스 추가**

`src/types/meeting.ts` 파일 끝에 다음을 추가한다:

```typescript
export interface MeetingDetail {
  meetingId: number;
  round: number;
  scheduledAt: string;          // ISO 8601, 예: "2026-05-08T14:00:00"
  durationSec: number | null;
  status: "PENDING" | "RECORDING" | "ANALYZING" | "COMPLETED";
  leaderName: string;
  memberName: string;
}
```

- [ ] **Step 2: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/types/meeting.ts
git commit -m "feat: add MeetingDetail API response type"
```

---

## Task 2: API 함수 생성

**Files:**
- Create: `src/api/meetings.ts`

- [ ] **Step 1: `src/api/meetings.ts` 생성**

```typescript
import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail } from '@/types/meeting';

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/api/v1/meetings/${meetingId}`);
  return res.data.data;
}
```

- [ ] **Step 2: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/api/meetings.ts
git commit -m "feat: add fetchMeetingDetail API function"
```

---

## Task 3: useMeetingDetail 훅 생성

**Files:**
- Create: `src/features/meeting/useMeetingDetail.ts`

- [ ] **Step 1: `src/features/meeting/useMeetingDetail.ts` 생성**

```typescript
import { useState, useEffect } from 'react';
import { fetchMeetingDetail } from '@/api/meetings';
import type { MeetingDetail } from '@/types/meeting';

export function useMeetingDetail(meetingId: string | undefined) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchMeetingDetail(meetingId)
      .then(setMeeting)
      .catch(() => setError('미팅 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [meetingId]);

  return { meeting, loading, error };
}
```

- [ ] **Step 2: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/meeting/useMeetingDetail.ts
git commit -m "feat: add useMeetingDetail hook"
```

---

## Task 4: SurveyForm 컴포넌트 추출

**Files:**
- Create: `src/components/survey/SurveyForm.tsx`
- Modify: `src/pages/member/SurveyPage.tsx`

- [ ] **Step 1: `src/components/survey/SurveyForm.tsx` 생성**

기존 `SurveyPage`의 상태 로직과 Q1/Q2/Q3 폼을 이 컴포넌트로 이동한다. `PageLayout`과 `Header`는 포함하지 않는다.

```typescript
import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const issueOptions = ['업무 블로커', '커리어 성장', '팀 협업', '리소스 요청', '기타'];
const energyOptions = [
  { value: 1, icon: '😫', label: '많이 지침' },
  { value: 2, icon: '😳', label: '조금 힘듦' },
  { value: 3, icon: '😊', label: '보통' },
  { value: 4, icon: '😄', label: '좋음' },
  { value: 5, icon: '🔥', label: '최고!' },
];
const desiredRoleOptions = ['그냥 들어주기', '방향성 코칭', '의사결정 도움', '리소스 확보'];

interface SurveyFormProps {
  leaderName: string;
  scheduledAt: string;
  meetingId: number;
}

export default function SurveyForm({ leaderName, scheduledAt, meetingId }: SurveyFormProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number | null>(3);
  const [desiredRoles, setDesiredRoles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const canSubmit = selectedIssues.length > 0 && energyLevel !== null && desiredRoles.length > 0;

  const selectedEnergyLabel = useMemo(
    () => energyOptions.find((option) => option.value === energyLevel)?.label ?? '',
    [energyLevel],
  );

  const scheduledDate = useMemo(
    () =>
      new Date(scheduledAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }),
    [scheduledAt],
  );

  const toggleValue = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setMessage('');
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload = { meetingId, issues: selectedIssues, energyLevel, desiredRoles };
    console.log('survey payload', payload);
    setMessage('설문이 제출되었습니다.');
  };

  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col items-center">
      <p className="text-sm font-bold tracking-wide text-slate-400">
        {leaderName}님과 1on1이 예정되어 있습니다.
      </p>
      <h1 className="mt-5 text-center text-2xl font-bold leading-snug text-gray-900">
        사전 설문 조사를 진행해 주세요!
      </h1>
      <p className="mt-4 text-center text-base tracking-wide text-slate-400">{scheduledDate}</p>

      <Card className="mt-10 w-full rounded-[20px] border-gray-200 px-9 py-9 shadow-sm">
        <div className="space-y-9">
          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q1. 오늘 꼭 다루고 싶은 이슈는?</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {issueOptions.map((issue) => {
                const isSelected = selectedIssues.includes(issue);
                return (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => toggleValue(issue, selectedIssues, setSelectedIssues)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {issue}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q2. 지금 나의 에너지 레벨은?</h2>
            <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
              {energyOptions.map((energy) => {
                const isSelected = energy.value === energyLevel;
                return (
                  <button
                    key={energy.value}
                    type="button"
                    onClick={() => { setEnergyLevel(energy.value); setMessage(''); }}
                    className={`flex aspect-square min-h-[88px] flex-col items-center justify-center rounded-[18px] border text-center transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_0_0_1px_rgba(139,92,246,0.9)]'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl leading-none">{energy.icon}</span>
                    <span className="mt-3 text-[11px] font-bold">{energy.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q3. 이번 미팅에서 리더에게 바라는 역할은?</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {desiredRoleOptions.map((role) => {
                const isSelected = desiredRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleValue(role, desiredRoles, setDesiredRoles)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="pt-1">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`h-14 w-full text-base ${
                canSubmit
                  ? 'bg-gray-900 text-white hover:bg-gray-700'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-100 disabled:opacity-100'
              }`}
            >
              제출하기
            </Button>
            {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
            <p className="mt-9 text-center text-sm text-slate-400">
              소요시간 약 30초 <span aria-hidden="true">⏱️</span>
            </p>
            <span className="sr-only">현재 에너지 레벨: {selectedEnergyLabel}</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: `src/pages/member/SurveyPage.tsx`를 SurveyForm 래퍼로 교체**

```typescript
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageLayout from '@/components/layout/PageLayout';
import SurveyForm from '@/components/survey/SurveyForm';

export default function SurveyPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <PageLayout>
      <Header title="1on1 사전 설문" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[#F7F8FA] px-5 py-8 text-gray-900">
        <SurveyForm
          leaderName="이준혁"
          scheduledAt={new Date().toISOString()}
          meetingId={Number(meetingId ?? '0')}
        />
      </main>
    </PageLayout>
  );
}
```

> **참고:** `leaderName`과 `scheduledAt`은 SurveyPage가 자체 API를 연동하기 전까지 임시값을 사용한다. 멤버 MeetingDetailPage에서는 실제 API 데이터를 넘긴다.

- [ ] **Step 3: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 4: 브라우저 확인**

`npm run dev` 후 `http://localhost:5173/member/survey/1` 접속.  
기존 설문 화면과 동일하게 보이면 정상.

- [ ] **Step 5: 커밋**

```bash
git add src/components/survey/SurveyForm.tsx src/pages/member/SurveyPage.tsx
git commit -m "feat: extract SurveyForm component from SurveyPage"
```

---

## Task 5: 리더 MeetingDetailPage 리팩토링

**Files:**
- Modify: `src/pages/leader/MeetingDetailPage.tsx`

기존 `useMeetingStore` 의존성을 제거하고 `useMeetingDetail` 훅과 로컬 상태로 교체한다.

- [ ] **Step 1: `src/pages/leader/MeetingDetailPage.tsx` 전체 교체**

```typescript
import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useRecorder } from "@/features/meeting/useRecorder";
import { useUploadRecording } from "@/features/meeting/useUploadRecording";
import { useMeetingDetail } from "@/features/meeting/useMeetingDetail";
import StartMeetingModal from "@/components/ui/StartMeetingModal";
import EndMeetingModal from "@/components/ui/EndMeetingModal";
import RecordingFloatingBar from "@/components/ui/RecordingFloatingBar";
import AnalysisLoading from "@/components/loading/AnalysisLoading";
import type { MeetingDetail } from "@/types/meeting";

type LocalStatus = "pending" | "recording" | "analyzing";

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);
  const recorder = useRecorder();
  const { upload } = useUploadRecording();
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [localStatus, setLocalStatus] = useState<LocalStatus>("pending");

  const handleStartRecording = useCallback(async () => {
    await recorder.start();
    setLocalStatus("recording");
  }, [recorder]);

  const handleEndMeeting = useCallback(() => {
    recorder.stop();
    setLocalStatus("analyzing");
    setShowEnd(false);
    setTimeout(() => {
      const blob = recorder.getBlob();
      if (blob && meetingId) upload(meetingId, blob);
    }, 500);
  }, [recorder, meetingId, upload]);

  if (loading) {
    return (
      <PageLayout>
        <div className="p-8 text-sm text-gray-400">불러오는 중...</div>
      </PageLayout>
    );
  }

  if (error || !meeting) {
    return (
      <PageLayout>
        <div className="p-8">
          <div className="flex flex-col gap-4 items-start">
            <h1 className="text-xl font-bold">1on1 미팅</h1>
            <p className="text-sm text-gray-500">
              {error ?? "요청하신 미팅을 찾을 수 없습니다. 목록으로 돌아가서 다시 선택해주세요."}
            </p>
            <button
              onClick={() => navigate('/leader/meetings')}
              className="rounded-lg bg-[#5F74FA] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4E62E6]"
            >
              1on1 목록으로 이동
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (localStatus === "analyzing") {
    return (
      <PageLayout>
        <div className="flex flex-col">
          <MeetingHeader meeting={meeting} />
          <AnalysisLoading role="leader" recordingDuration={recorder.elapsed} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          <MeetingHeader meeting={meeting} />

          {!recorder.isRecording && localStatus === "pending" && (
            <div className="border-t border-gray-200 px-8 py-4 flex justify-center">
              <button
                onClick={() => setShowStart(true)}
                className="px-8 py-3 rounded-full text-white font-medium bg-[#5F74FA] hover:bg-[#4E62E6] shadow-lg shadow-[#5F74FA]/30 transition-all"
              >
                1on1 미팅 시작하기
              </button>
            </div>
          )}
        </div>

        <div className="w-[280px] border-l border-gray-200 p-6 flex flex-col gap-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">나만의 노트</h4>
            <textarea
              className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[#4E62E6]"
              placeholder="나만 볼 수 있는 메모입니다."
            />
          </div>
        </div>

        <StartMeetingModal isOpen={showStart} onClose={() => setShowStart(false)} onStart={handleStartRecording} />
        <EndMeetingModal isOpen={showEnd} onClose={() => setShowEnd(false)} onEnd={handleEndMeeting} />
        <RecordingFloatingBar
          isRecording={recorder.isRecording}
          elapsed={recorder.elapsed}
          audioLevel={recorder.audioLevel}
          isLeader={true}
          onEndClick={() => setShowEnd(true)}
        />
      </div>
    </PageLayout>
  );
}

function MeetingHeader({ meeting }: { meeting: MeetingDetail }) {
  const dateStr = new Date(meeting.scheduledAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-8 py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold">{dateStr}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <span className="w-6 h-6 rounded-full bg-[#5F74FA] flex items-center justify-center text-white text-xs">
          {meeting.leaderName[0]}
        </span>
        <span>{meeting.leaderName} (리더)</span>
        <span className="text-gray-300">↔</span>
        <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs">
          {meeting.memberName[0]}
        </span>
        <span>{meeting.memberName}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 3: 브라우저 확인**

`http://localhost:5173/leader/meeting/10` 접속 (백엔드 실행 중이어야 함).  
- 로딩 스피너 → 미팅 정보 표시 순서 확인  
- "1on1 미팅 시작하기" 버튼 표시 확인  
- 없는 ID(`/leader/meeting/9999`)로 접속 시 에러 메시지 + 목록 버튼 확인

- [ ] **Step 4: 커밋**

```bash
git add src/pages/leader/MeetingDetailPage.tsx
git commit -m "feat: refactor leader MeetingDetailPage to use API"
```

---

## Task 6: 멤버 MeetingDetailPage 생성

**Files:**
- Create: `src/pages/member/MeetingDetailPage.tsx`

- [ ] **Step 1: `src/pages/member/MeetingDetailPage.tsx` 생성**

```typescript
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useMeetingDetail } from "@/features/meeting/useMeetingDetail";
import SurveyForm from "@/components/survey/SurveyForm";
import AnalysisLoading from "@/components/loading/AnalysisLoading";
import type { MeetingDetail } from "@/types/meeting";

export default function MemberMeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);

  if (loading) {
    return (
      <PageLayout>
        <div className="p-8 text-sm text-gray-400">불러오는 중...</div>
      </PageLayout>
    );
  }

  if (error || !meeting) {
    return (
      <PageLayout>
        <div className="p-8">
          <div className="flex flex-col gap-4 items-start">
            <h1 className="text-xl font-bold">1on1 미팅</h1>
            <p className="text-sm text-gray-500">
              {error ?? "요청하신 미팅을 찾을 수 없습니다."}
            </p>
            <button
              onClick={() => navigate('/member/dashboard')}
              className="rounded-lg bg-[#5F74FA] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4E62E6]"
            >
              대시보드로 이동
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (meeting.status === "ANALYZING") {
    return (
      <PageLayout>
        <div className="flex flex-col">
          <MeetingHeader meeting={meeting} />
          <AnalysisLoading role="member" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col">
        <MeetingHeader meeting={meeting} />
        <div className="bg-[#F7F8FA] px-5 py-8">
          <SurveyForm
            leaderName={meeting.leaderName}
            scheduledAt={meeting.scheduledAt}
            meetingId={meeting.meetingId}
          />
        </div>
      </div>
    </PageLayout>
  );
}

function MeetingHeader({ meeting }: { meeting: MeetingDetail }) {
  const dateStr = new Date(meeting.scheduledAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-8 py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold">{dateStr}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <span className="w-6 h-6 rounded-full bg-[#5F74FA] flex items-center justify-center text-white text-xs">
          {meeting.leaderName[0]}
        </span>
        <span>{meeting.leaderName} (리더)</span>
        <span className="text-gray-300">↔</span>
        <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs">
          나
        </span>
        <span>나</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 타입 검사**

```bash
npm run type-check
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/pages/member/MeetingDetailPage.tsx
git commit -m "feat: add member MeetingDetailPage with embedded SurveyForm"
```

---

## Task 7: 라우터 업데이트

**Files:**
- Modify: `src/app/router.tsx`

- [ ] **Step 1: 라우터에서 멤버 미팅 라우트 교체**

`src/app/router.tsx`의 import 블록과 라우트 배열을 수정한다:

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import LeaderDashboard from '@/pages/leader/LeaderDashboard';
import MeetingsPage from '@/pages/leader/MeetingsPage';
import LeaderMeetingDetailPage from '@/pages/leader/MeetingDetailPage';
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberMeetingDetailPage from '@/pages/member/MeetingDetailPage';
import SurveyPage from '@/pages/member/SurveyPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/leader/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/leader/dashboard', element: <LeaderDashboard /> },
  { path: '/leader/meetings', element: <MeetingsPage /> },
  { path: '/leader/meeting/:meetingId', element: <LeaderMeetingDetailPage /> },
  { path: '/leader/promises', element: <PromiseLedgerPage /> },
  { path: '/leader/reports', element: <LeaderDashboard /> },
  { path: '/leader/9box', element: <LeaderDashboard /> },
  { path: '/leader/overview', element: <LeaderDashboard /> },
  { path: '/member/dashboard', element: <MemberDashboard /> },
  { path: '/member/meeting/:meetingId', element: <MemberMeetingDetailPage /> },
  { path: '/member/survey/:meetingId', element: <SurveyPage /> },
  { path: '/settings', element: <LeaderDashboard /> },
  { path: '/invite', element: <LeaderDashboard /> },
]);

export default router;
```

> `MeetingFeedbackPage` import와 `/meeting` (무 :id) 라우트는 제거한다.

- [ ] **Step 2: 타입 검사 및 린트**

```bash
npm run type-check && npm run lint
```

Expected: 오류 없음

- [ ] **Step 3: 브라우저 최종 확인**

`npm run dev` 후:
1. `http://localhost:5173/leader/meeting/10` → 리더 화면 (시작 버튼 표시)
2. `http://localhost:5173/member/meeting/11` → 멤버 화면 (설문 폼 표시)
3. `http://localhost:5173/member/survey/11` → 기존 전체 설문 페이지 정상 표시

- [ ] **Step 4: 커밋**

```bash
git add src/app/router.tsx
git commit -m "feat: wire leader/member MeetingDetailPage routes"
```
