import type { RadarMember } from '@/types/analysis';

// ScatterRadar 위험도 분류 케이스 전체 커버
// - 명시적 위험: surfaceScore < 25 (갭 무관)
// - 조용한 위험: |surface - inferred| > 50
// - 안전:        |surface - inferred| < 25
// - 보수적:      나머지

export const MOCK_RADAR: RadarMember[] = [
  // ── 명시적 위험 (surface < 25) ──
  { memberId: 'm1', name: '멤버A', surfaceScore: 10, inferredScore: 15 }, // 갭 작아도 명시적 위험
  { memberId: 'm2', name: '멤버B', surfaceScore: 20, inferredScore: 65 }, // 갭 크고 surface 낮음

  // ── 조용한 위험 (surface >= 25, gap > 50) ──
  { memberId: 'm3', name: '멤버C', surfaceScore: 80, inferredScore: 25 }, // 겉으론 만족, 속은 불만
  { memberId: 'm4', name: '멤버D', surfaceScore: 30, inferredScore: 85 }, // 겉은 불만, 속은 만족

  // ── 안전 (gap < 25) ──
  { memberId: 'm5', name: '멤버E', surfaceScore: 75, inferredScore: 80 },
  { memberId: 'm6', name: '멤버F', surfaceScore: 60, inferredScore: 70 },

  // ── 보수적 (gap 25~50) ──
  { memberId: 'm7', name: '멤버G', surfaceScore: 55, inferredScore: 30 }, // gap = 25
  { memberId: 'm8', name: '멤버H', surfaceScore: 70, inferredScore: 40 }, // gap = 30
];