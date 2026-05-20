# Team Setup Flow — Design Spec

**Date:** 2026-05-20  
**Feature:** 팀 미소속 사용자를 위한 팀 생성/참여 플로우  
**Branch:** jisu-team

---

## 배경

신규 가입 사용자는 어떤 팀에도 속하지 않은 상태로 시작한다(`teamId === ''`). 이 상태에서 대시보드나 미팅 화면을 보여주는 것은 의미가 없으므로, 역할에 따라 팀 생성(리더) 또는 팀 참여(멤버) 화면을 먼저 보여줘야 한다.

---

## 적용 범위

- 신규 회원가입 후 최초 진입
- 기존 계정이지만 아직 팀에 소속되지 않은 경우
- URL 직접 입력으로 보호된 라우트 접근 시도

---

## 아키텍처

### 라우트 가드: `RequiresTeam`

위치: `src/features/auth/RequiresTeam.tsx`

보호된 모든 리더/멤버 라우트를 `<RequiresTeam>`으로 감싼다. 진입 시 아래 순서로 판단한다.

```
token 없음          → /login 리다이렉트
user 없음 (로딩중)  → null 반환 (렌더링 대기)
teamId === ''       → role에 따라 /leader/team-setup 또는 /member/team-join 리다이렉트
teamId 있음         → 자식 컴포넌트 정상 렌더링
```

`/leader/team-setup`과 `/member/team-join`은 `RequiresTeam`으로 감싸지 않는다. 팀 없는 상태에서 접근해야 하는 페이지이기 때문이다.

### 이중 보호

1. **LoginPage / SignupPage**: 로그인·회원가입 직후 `teamId === ''`이면 팀 셋업 페이지로 리다이렉트
2. **RequiresTeam**: URL 직접 입력 등 모든 보호 라우트 진입 시 재확인

---

## 새 라우트

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/leader/team-setup` | `TeamSetupPage` | 리더 팀 생성 |
| `/member/team-join` | `TeamJoinPage` | 멤버 초대코드 입력 |

---

## 페이지 명세

### TeamSetupPage (`/leader/team-setup`)

- 팀 이름 입력 필드 (2~30자)
- "팀 생성하기" 버튼
- 생성 성공 시: **초대 코드 모달** 표시
  - 초대 코드 텍스트 (클릭 시 클립보드 복사)
  - "확인" 버튼 → `/leader/dashboard` 이동
- 에러: 인라인 에러 메시지

### TeamJoinPage (`/member/team-join`)

- 초대 코드 입력 필드
- "참여하기" 버튼
- 참여 성공 시: **팀 참여 확인 모달** 표시
  - "{teamName}에 참여했습니다."
  - "확인" 버튼 → `/member/dashboard` 이동
- 에러 처리:
  - `TEAM_NOT_FOUND` → "유효하지 않은 초대 코드입니다"
  - `ALREADY_IN_TEAM` → "이미 팀에 소속되어 있습니다"

---

## API 레이어

### `src/api/teams.ts` (신규)

```typescript
createTeam(name: string): Promise<CreateTeamResult>
// POST /api/v1/teams
// 반환: { id, name, leaderId, leaderName, inviteCode }

joinTeam(inviteCode: string): Promise<JoinTeamResult>
// POST /api/v1/teams/join
// 반환: { teamId, teamName }
```

---

## Features 레이어

### `src/features/team/useCreateTeam.ts` (신규)

1. `createTeam(name)` 호출
2. 성공 시 `fetchMe()` → `setAuth(freshUser, token)` 으로 authStore 갱신
3. `inviteCode` 반환 (페이지에서 모달 표시에 사용)
4. 상태: `isLoading`, `error`

### `src/features/team/useJoinTeam.ts` (신규)

1. `joinTeam(inviteCode)` 호출
2. 성공 시 `fetchMe()` → `setAuth(freshUser, token)` 으로 authStore 갱신
3. `teamName` 반환 (페이지에서 모달 표시에 사용)
4. 상태: `isLoading`, `error`
5. 에러 코드 → 한국어 메시지 변환 처리

---

## authStore 갱신 전략

팀 생성/참여 성공 후 `GET /api/v1/users/me`를 호출해 최신 user 객체(teamId, teamName 포함)를 받아 `setAuth(freshUser, existingToken)`으로 갱신한다. 기존 authStore 인터페이스 변경 없음.

---

## 수정 대상 기존 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/router.tsx` | `RequiresTeam` 래퍼 적용, 2개 신규 라우트 추가 |
| `src/pages/auth/LoginPage.tsx` | 로그인 후 `teamId === ''` 체크 → 팀 셋업 페이지 리다이렉트 |
| `src/pages/auth/SignupPage.tsx` | 회원가입 성공 후 `authUser` 반환값을 사용해 `/login` 리다이렉트 대신 팀 셋업 페이지로 직접 이동. (`useSignup`은 이미 auth state를 설정하므로 재로그인 불필요) |

---

## 신규 파일 목록

| 파일 | 역할 |
|------|------|
| `src/features/auth/RequiresTeam.tsx` | 라우트 가드 컴포넌트 |
| `src/pages/leader/TeamSetupPage.tsx` | 리더 팀 생성 페이지 |
| `src/pages/member/TeamJoinPage.tsx` | 멤버 팀 참여 페이지 |
| `src/features/team/useCreateTeam.ts` | 팀 생성 훅 |
| `src/features/team/useJoinTeam.ts` | 팀 참여 훅 |
| `src/api/teams.ts` | teams API 함수 |
