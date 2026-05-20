# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReadB is a B2B HR SaaS frontend that quantifies the "Honesty Gap" in 1-on-1 meetings using AI. It serves two user roles: **leader** (리더) and **member** (멤버).

## Commands

```bash
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # tsc + vite build
npm run lint         # ESLint on src/**/*.{ts,tsx}
npm run type-check   # tsc --noEmit
```

Environment variable required: `VITE_API_BASE_URL` (defaults to `http://localhost:8080`).

## Architecture

### Two-team Ownership Model

**FE1** owns `pages/`, `features/`, `api/` functions, and routing. Pages consume components via props only — no component API calls.

**FE2** owns `components/`, `stores/` initial setup, `styles/`. Components are pure renderers: they export a Props interface and receive all data from outside.

Boundary rule: FE1 never touches `components/`; FE2 never touches `pages/`.

### State Management

Two Zustand stores:
- `stores/authStore.ts` — `user`, `token`, `setAuth`, `clearAuth`. Token is also mirrored to `localStorage` and read directly by `api/client.ts` on every request.
- `stores/meetingStore.ts` — client-side meeting list, `createMeeting`, `updateMeetingStatus`, `setRecordingDuration`, modal open state. Meetings are created in-memory (no persistence).

### API Client

`api/client.ts` is an Axios instance that reads `localStorage.getItem('token')` directly (not from Zustand) for Authorization headers. Base URL from `VITE_API_BASE_URL`.

### Meeting Recording Flow

`MeetingDetailPage` orchestrates the full recording lifecycle:
1. `useRecorder` — wraps `MediaRecorder` + Web Audio API for waveform level. Records as `audio/webm`. Blob is held in a ref until `stop()`.
2. `useUploadRecording` — posts blob as `FormData` to `/meetings/upload`. **Currently a stub** (API call is commented out).
3. `useMeetingStatus` — polls BE for `analyzing → completed` transition every 3s. **Currently a stub** (20s demo timer, polling logic commented out).

Meeting status progression: `pending → recording → analyzing → completed`.

### Path Aliases

`@/` maps to `src/` (configured in Vite). Always use `@/` imports, never relative `../` across directories.

## Key Structural Decisions

- **`components/blocker/`** — Three sub-components (`BlockerActionList`, `BlockerDetailCard`, `BlockerSummaryNote`) that compose into the blocker analysis view. Distinct from `components/charts/BlockerCloud`.
- **`components/ui/`** wraps shadcn/ui primitives. When customizing, wrap the original rather than modifying it in place.
- **`data/mockRadarData.ts`** — Dummy data used for the radar chart until the real API is wired. Remove when `useRadarData` connects to BE.
- **`types/meeting.ts`** has two overlapping shapes: `Meeting` (API shape) and `MeetingData` (client store shape). `MeetingData` is what the store and pages use.

## Routes

```
/                         → redirect to /leader/dashboard
/login, /signup
/leader/dashboard         LeaderDashboard
/leader/meetings          MeetingsPage
/leader/meeting/:id       MeetingDetailPage
/leader/promises          PromiseLedgerPage
/member/dashboard         MemberDashboard
/member/meeting/:id       MeetingFeedbackPage
/member/survey/:id        SurveyPage
/meeting                  MeetingDetailPage (no :id)
/leader/reports, /leader/9box, /leader/overview, /settings, /invite → all stub to LeaderDashboard
```

## Shared File Rules

- `types/` and `constants/` — additions only; renames/deletes require team notification.
- `api/types.ts` — BE response shapes go here; `ApiResponse<T>` is the standard wrapper.
- `App.tsx`, `api/client.ts`, `stores/authStore.ts` — notify other team before modifying; merge that PR first, then rebase.
- Branch naming: `feat/fe1-<feature>` or `feat/fe2-<feature>`.
