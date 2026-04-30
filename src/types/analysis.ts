export interface RadarMember {
  memberId: string
  name: string
  /** 사전 서베이 점수 (X축, 0~100) */
  surfaceScore: number
  /** AI 뉘앙스 추론 점수 (Y축, 0~100) */
  inferredScore: number
}

export interface BlockerWord {
  text: string
  value: number
}

export interface FeedbackCard {
  id: string
  title: string
  body: string
  actionGuide: string
  category: 'communication' | 'growth' | 'risk' | 'strength'
}

export interface CareerMemoryItem {
  id: string
  meetingId: string
  date: string
  keyword: string
  type: 'achievement' | 'concern' | 'learning'
  summary: string
}

export interface GapScore {
  surface: number
  inferred: number
  gap: number
}
