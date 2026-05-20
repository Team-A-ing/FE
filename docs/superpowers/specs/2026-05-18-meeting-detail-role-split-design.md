# 미팅 상세 페이지 역할 분리 설계

**날짜:** 2026-05-18  
**브랜치:** jisu-meeting

---

## 배경

기존 `MeetingDetailPage`는 리더 전용으로만 작성되어 있고, 멤버가 접근하는 미팅 상세 화면이 없었다. 또한 미팅 데이터를 인메모리 store에서 읽고 있어 실제 백엔드 데이터와 연동이 안 되어 있었다.

---

## 목표

- 리더와 멤버 각각 전용 미팅 상세 페이지를 분리 구현
- 리더: 기존 미팅 시작/녹음 플로우 유지
- 멤버: SurveyPage 폼 콘텐츠를 `<div>`로 임베드한 화면 제공
- 백엔드 단건 조회 API 연동

---

## 합의된 백엔드 API

### 미팅 단건 조회

```
GET /api/v1/meetings/:meetingId
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "meetingId": 10,
    "round": 12,
    "scheduledAt": "2026-05-08T14:00:00",
    "durationSec": 2400,
    "status": "COMPLETED",
    "leaderName": "이준혁",
    "memberName": "강다은"
  }
}
```

**보안:** 서버는 토큰 기반으로 요청자가 해당 미팅의 리더 또는 멤버인지 검증. 관계없는 사용자는 403 반환. 응답 데이터는 두 역할 모두 동일.

---

## 파일 구조

```
src/
├── api/
│   └── meetings.ts                       (신규) API 함수
├── features/meeting/
│   └── useMeetingDetail.ts               (신규) 단건 조회 훅
├── components/survey/
│   └── SurveyForm.tsx                    (신규) SurveyPage에서 폼 추출
├── pages/
│   ├── leader/
│   │   └── MeetingDetailPage.tsx         (리팩토링) API 연동
│   └── member/
│       └── MeetingDetailPage.tsx         (신규) SurveyForm 임베드
└── types/
    └── meeting.ts                        (수정) MeetingDetail 타입 추가
```

---

## 라우팅

```
/leader/meeting/:meetingId  →  pages/leader/MeetingDetailPage
/member/meeting/:meetingId  →  pages/member/MeetingDetailPage   ← 변경 (기존: MeetingFeedbackPage)
/member/survey/:meetingId   →  pages/member/SurveyPage          ← 유지 (SurveyForm 래퍼)
```

**MeetingFeedbackPage 처리:**  
기존 `MeetingFeedbackPage`는 파일은 유지하되 라우터에서 제거한다.  
완료된 미팅(COMPLETED)의 피드백 화면은 추후 별도 스펙으로 처리한다.  
이번 스코프에서 `MemberMeetingDetailPage`는 PENDING / ANALYZING 상태만 처리한다.

---

## 데이터 흐름

### `useMeetingDetail(meetingId: string)`

```
1. GET /api/v1/meetings/:meetingId 호출
2. loading / error / meeting 반환
3. meeting 타입: MeetingDetail (아래 타입 섹션 참조)
```

두 페이지(리더/멤버) 모두 이 훅 하나를 사용.

---

## 타입

`src/types/meeting.ts`에 추가:

```ts
export interface MeetingDetail {
  meetingId: number;
  round: number;
  scheduledAt: string;
  durationSec: number | null;
  status: "PENDING" | "RECORDING" | "ANALYZING" | "COMPLETED";
  leaderName: string;
  memberName: string;
}
```

---

## 각 페이지 화면 구성

### 리더 MeetingDetailPage

- 미팅 헤더: 날짜, `leaderName(나) ↔ memberName` 표시
- `status === "PENDING"` → "1on1 미팅 시작하기" 버튼
- 녹음 플로우 유지: StartMeetingModal, RecordingFloatingBar, EndMeetingModal
- 오른쪽 사이드바 "나만의 노트" 유지
- `status === "ANALYZING"` → AnalysisLoading

### 멤버 MeetingDetailPage

- 미팅 헤더: 날짜, `leaderName ↔ 나` 표시
- `<div>` 안에 `<SurveyForm leaderName={meeting.leaderName} scheduledAt={meeting.scheduledAt} />` 임베드
- 녹음/시작 버튼 없음

### SurveyForm 컴포넌트

- 기존 `SurveyPage`의 Q1/Q2/Q3 + 제출 버튼 로직 추출
- Props: `leaderName: string`, `scheduledAt: string`
- `SurveyPage`는 `<SurveyForm>`을 감싸는 래퍼로만 남음 (기존 라우트 유지)

---

## 오너십 (CLAUDE.md 기준)

| 파일 | 팀 |
|------|-----|
| `pages/leader/MeetingDetailPage.tsx` | FE1 |
| `pages/member/MeetingDetailPage.tsx` | FE1 |
| `api/meetings.ts` | FE1 |
| `features/meeting/useMeetingDetail.ts` | FE1 |
| `components/survey/SurveyForm.tsx` | FE2 |
| `types/meeting.ts` | 공통 (추가만) |
