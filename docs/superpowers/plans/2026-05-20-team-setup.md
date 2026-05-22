# Team Setup Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 팀에 소속되지 않은 사용자(`teamId === ''`)가 대시보드 대신 팀 생성(리더) 또는 팀 참여(멤버) 화면으로 자동 리다이렉트되도록 구현한다.

**Architecture:** 이중 보호 전략 — LoginPage/SignupPage에서 로그인 직후 `teamId` 체크 후 분기, `RequiresTeam` 컴포넌트로 모든 보호 라우트를 감싸 URL 직접 입력도 차단. 팀 생성/참여 성공 후 `fetchMe()`로 authStore를 최신 상태로 갱신.

**Tech Stack:** React 18, React Router v6, Zustand, Axios, TypeScript, Tailwind CSS

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/types/user.ts` | `teamName?: string` 필드 추가 |
| Create | `src/api/user.ts` | `fetchMe()` — GET /api/v1/users/me |
| Create | `src/api/teams.ts` | `createTeam()`, `joinTeam()` |
| Create | `src/features/team/useCreateTeam.ts` | 팀 생성 훅 |
| Create | `src/features/team/useJoinTeam.ts` | 팀 참여 훅 |
| Create | `src/features/auth/RequiresTeam.tsx` | 라우트 가드 컴포넌트 |
| Create | `src/pages/leader/TeamSetupPage.tsx` | 리더 팀 생성 페이지 |
| Create | `src/pages/member/TeamJoinPage.tsx` | 멤버 팀 참여 페이지 |
| Modify | `src/app/router.tsx` | RequiresTeam 래퍼, 신규 라우트 추가 |
| Modify | `src/pages/auth/LoginPage.tsx` | teamId 체크 후 분기 |
| Modify | `src/pages/auth/SignupPage.tsx` | 회원가입 후 직접 팀 셋업으로 이동 |

---

### Task 1: Types + API Layer

**Files:**
- Modify: `src/types/user.ts`
- Create: `src/api/user.ts`
- Create: `src/api/teams.ts`

- [ ] **Step 1: `teamName` 필드를 `User` 타입에 추가**

`src/types/user.ts`를 아래와 같이 수정:

```ts
export type UserRole = 'leader' | 'member'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  teamId: string
  teamName?: string
}
```

- [ ] **Step 2: `src/api/user.ts` 생성**

```ts
import apiClient from './client';
import type { ApiResponse } from './types';
import type { User, UserRole } from '@/types/user';

interface MeApiUser {
  id: string | number;
  email: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
  teamId?: string | number | null;
  teamName?: string | null;
}

const toUser = (u: MeApiUser): User => ({
  id: String(u.id),
  email: u.email,
  name: u.name,
  role: (u.role === 'LEADER' ? 'leader' : 'member') as UserRole,
  teamId: u.teamId == null ? '' : String(u.teamId),
  teamName: u.teamName ?? undefined,
});

export async function fetchMe(): Promise<User> {
  const res = await apiClient.get<ApiResponse<MeApiUser>>('/api/v1/users/me');
  return toUser(res.data.data);
}
```

- [ ] **Step 3: `src/api/teams.ts` 생성**

```ts
import apiClient from './client';
import type { ApiResponse } from './types';

interface CreateTeamApiResponse {
  id: string | number;
  name: string;
  leaderId: string | number;
  leaderName: string;
  inviteCode: string;
}

interface JoinTeamApiResponse {
  teamId: string | number;
  teamName: string;
}

export interface CreateTeamResult {
  id: string;
  name: string;
  inviteCode: string;
}

export interface JoinTeamResult {
  teamId: string;
  teamName: string;
}

export async function createTeam(name: string): Promise<CreateTeamResult> {
  const res = await apiClient.post<ApiResponse<CreateTeamApiResponse>>('/api/v1/teams', { name });
  const d = res.data.data;
  return { id: String(d.id), name: d.name, inviteCode: d.inviteCode };
}

export async function joinTeam(inviteCode: string): Promise<JoinTeamResult> {
  const res = await apiClient.post<ApiResponse<JoinTeamApiResponse>>('/api/v1/teams/join', { inviteCode });
  const d = res.data.data;
  return { teamId: String(d.teamId), teamName: d.teamName };
}
```

- [ ] **Step 4: 타입 체크**

실행: `npm run type-check`  
기대 결과: 에러 없음

- [ ] **Step 5: Commit**

```bash
git add src/types/user.ts src/api/user.ts src/api/teams.ts
git commit -m "feat: add teamName to User type and create teams/user API functions"
```

---

### Task 2: Feature Hooks

**Files:**
- Create: `src/features/team/useCreateTeam.ts`
- Create: `src/features/team/useJoinTeam.ts`

- [ ] **Step 1: `src/features/team/useCreateTeam.ts` 생성**

```ts
import { useState } from 'react';
import { createTeam } from '@/api/teams';
import { fetchMe } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';

export function useCreateTeam() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (name: string): Promise<string> => {
    setIsLoading(true);
    setError('');
    try {
      const result = await createTeam(name);
      const freshUser = await fetchMe();
      setAuth(freshUser, token ?? '');
      return result.inviteCode;
    } catch {
      const message = '팀 생성에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
```

- [ ] **Step 2: `src/features/team/useJoinTeam.ts` 생성**

```ts
import { useState } from 'react';
import { joinTeam } from '@/api/teams';
import { fetchMe } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';

const ERROR_MESSAGES: Record<string, string> = {
  TEAM_NOT_FOUND: '유효하지 않은 초대 코드입니다.',
  ALREADY_IN_TEAM: '이미 팀에 소속되어 있습니다.',
};

export function useJoinTeam() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const join = async (inviteCode: string): Promise<string> => {
    setIsLoading(true);
    setError('');
    try {
      const result = await joinTeam(inviteCode);
      const freshUser = await fetchMe();
      setAuth(freshUser, token ?? '');
      return result.teamName;
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'response' in err
          ? (err.response as { data?: { code?: string } })?.data?.code
          : undefined;
      const message = (code && ERROR_MESSAGES[code]) ?? '팀 참여에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { join, isLoading, error };
}
```

- [ ] **Step 3: 타입 체크**

실행: `npm run type-check`  
기대 결과: 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/features/team/useCreateTeam.ts src/features/team/useJoinTeam.ts
git commit -m "feat: add useCreateTeam and useJoinTeam hooks"
```

---

### Task 3: RequiresTeam Route Guard

**Files:**
- Create: `src/features/auth/RequiresTeam.tsx`

- [ ] **Step 1: `src/features/auth/RequiresTeam.tsx` 생성**

```tsx
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  children: ReactNode;
}

export default function RequiresTeam({ children }: Props) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return null;
  if (user.teamId === '') {
    return <Navigate to={user.role === 'leader' ? '/leader/team-setup' : '/member/team-join'} replace />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: 타입 체크**

실행: `npm run type-check`  
기대 결과: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/RequiresTeam.tsx
git commit -m "feat: add RequiresTeam route guard component"
```

---

### Task 4: TeamSetupPage

**Files:**
- Create: `src/pages/leader/TeamSetupPage.tsx`

- [ ] **Step 1: `src/pages/leader/TeamSetupPage.tsx` 생성**

```tsx
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useCreateTeam } from '@/features/team/useCreateTeam';

export default function TeamSetupPage() {
  const navigate = useNavigate();
  const { create, isLoading, error } = useCreateTeam();
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = teamName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) return;
    try {
      const code = await create(trimmed);
      setInviteCode(code);
      setModalOpen(true);
    } catch {
      // error is set in hook
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate('/leader/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-black">팀 만들기</h1>
        <p className="mb-8 text-center text-sm text-gray-500">팀 이름을 입력하고 팀을 생성하세요.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">팀 이름</span>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀 이름을 입력하세요 (2~30자)"
              minLength={2}
              maxLength={30}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading || teamName.trim().length < 2}>
            {isLoading ? '생성 중...' : '팀 생성하기'}
          </Button>
        </form>

        <Modal open={modalOpen} onClose={() => {}}>
          <h2 className="mb-4 text-lg font-bold text-black">팀이 생성되었습니다!</h2>
          <p className="mb-2 text-sm text-gray-600">아래 초대 코드를 팀원에게 공유하세요.</p>
          <button
            type="button"
            onClick={handleCopy}
            className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center font-mono text-lg font-semibold tracking-widest text-black hover:bg-gray-100"
          >
            {inviteCode}
          </button>
          {copied && <p className="mb-2 text-center text-xs text-green-600">클립보드에 복사되었습니다.</p>}
          <Button className="w-full" onClick={handleConfirm}>
            확인
          </Button>
        </Modal>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 타입 체크**

실행: `npm run type-check`  
기대 결과: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/pages/leader/TeamSetupPage.tsx
git commit -m "feat: add TeamSetupPage for leader team creation"
```

---

### Task 5: TeamJoinPage

**Files:**
- Create: `src/pages/member/TeamJoinPage.tsx`

- [ ] **Step 1: `src/pages/member/TeamJoinPage.tsx` 생성**

```tsx
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useJoinTeam } from '@/features/team/useJoinTeam';

export default function TeamJoinPage() {
  const navigate = useNavigate();
  const { join, isLoading, error } = useJoinTeam();
  const [inviteCode, setInviteCode] = useState('');
  const [joinedTeamName, setJoinedTeamName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inviteCode.trim();
    if (!trimmed) return;
    try {
      const teamName = await join(trimmed);
      setJoinedTeamName(teamName);
      setModalOpen(true);
    } catch {
      // error is set in hook
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate('/member/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-black">팀 참여하기</h1>
        <p className="mb-8 text-center text-sm text-gray-500">리더에게 받은 초대 코드를 입력하세요.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">초대 코드</span>
            <Input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="초대 코드를 입력하세요"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading || !inviteCode.trim()}>
            {isLoading ? '참여 중...' : '참여하기'}
          </Button>
        </form>

        <Modal open={modalOpen} onClose={() => {}}>
          <h2 className="mb-4 text-lg font-bold text-black">{joinedTeamName}에 참여했습니다.</h2>
          <Button className="w-full" onClick={handleConfirm}>
            확인
          </Button>
        </Modal>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 타입 체크**

실행: `npm run type-check`  
기대 결과: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/pages/member/TeamJoinPage.tsx
git commit -m "feat: add TeamJoinPage for member team joining"
```

---

### Task 6: Wire Up — Router + Auth Pages

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/pages/auth/LoginPage.tsx`
- Modify: `src/pages/auth/SignupPage.tsx`

- [ ] **Step 1: `src/app/router.tsx` 전체 교체**

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RequiresTeam from '@/features/auth/RequiresTeam';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import LeaderDashboard from '@/pages/leader/LeaderDashboard';
import MeetingsPage from '@/pages/leader/MeetingsPage';
import LeaderMeetingDetailPage from '@/pages/leader/MeetingDetailPage';
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage';
import TeamSetupPage from '@/pages/leader/TeamSetupPage';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberMeetingDetailPage from '@/pages/member/MeetingDetailPage';
import SurveyPage from '@/pages/member/SurveyPage';
import TeamJoinPage from '@/pages/member/TeamJoinPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/leader/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/leader/team-setup', element: <TeamSetupPage /> },
  { path: '/member/team-join', element: <TeamJoinPage /> },
  { path: '/leader/dashboard', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/leader/meetings', element: <RequiresTeam><MeetingsPage /></RequiresTeam> },
  { path: '/leader/meeting/:meetingId', element: <RequiresTeam><LeaderMeetingDetailPage /></RequiresTeam> },
  { path: '/leader/promises', element: <RequiresTeam><PromiseLedgerPage /></RequiresTeam> },
  { path: '/leader/reports', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/leader/9box', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/leader/overview', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/member/dashboard', element: <RequiresTeam><MemberDashboard /></RequiresTeam> },
  { path: '/member/meeting/:meetingId', element: <RequiresTeam><MemberMeetingDetailPage /></RequiresTeam> },
  { path: '/member/survey/:meetingId', element: <RequiresTeam><SurveyPage /></RequiresTeam> },
  { path: '/settings', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/invite', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
]);

export default router;
```

- [ ] **Step 2: `src/pages/auth/LoginPage.tsx` 수정**

`handleSubmit`의 `navigate` 호출 부분 수정 (line 25 교체):

변경 전:
```tsx
navigate(user.role === 'leader' ? '/leader/dashboard' : '/member/dashboard');
```

변경 후:
```tsx
if (user.teamId === '') {
  navigate(user.role === 'leader' ? '/leader/team-setup' : '/member/team-join');
} else {
  navigate(user.role === 'leader' ? '/leader/dashboard' : '/member/dashboard');
}
```

- [ ] **Step 3: `src/pages/auth/SignupPage.tsx` 수정**

`handleSubmit` try 블록 내 `signup()` 호출 이후 3줄을 교체:

변경 전 (lines 82-92):
```tsx
await signup({
  name: form.name.trim(),
  email: form.email.trim(),
  password: form.password,
  role: form.role,
  jobTitle: form.jobTitle,
});

setMessage('가입이 성공하였습니다!');
setMessageType('success');
window.setTimeout(() => navigate('/login'), 1000);
```

변경 후:
```tsx
const authUser = await signup({
  name: form.name.trim(),
  email: form.email.trim(),
  password: form.password,
  role: form.role,
  jobTitle: form.jobTitle,
});

if (authUser) {
  navigate(authUser.role === 'leader' ? '/leader/team-setup' : '/member/team-join');
} else {
  setMessage('가입이 성공하였습니다!');
  setMessageType('success');
  window.setTimeout(() => navigate('/login'), 1000);
}
```

- [ ] **Step 4: 타입 체크 + 린트**

실행: `npm run type-check && npm run lint`  
기대 결과: 에러 없음

- [ ] **Step 5: Commit**

```bash
git add src/app/router.tsx src/pages/auth/LoginPage.tsx src/pages/auth/SignupPage.tsx
git commit -m "feat: wire RequiresTeam guard and team-setup redirects in auth pages"
```
