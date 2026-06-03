import type { CommunicationBalance, RadarDataPoint } from '@/types/analysis';

export const MOCK_RADAR: RadarDataPoint[] = [
  {
    memberId: 1,
    memberName: '강다은',
    surveyScore: 87,
    safetyScore: 31,
    honestyGap: 56,
    direction: 'OVERREPORT',
    riskLevel: 'DANGER',
  },
  {
    memberId: 2,
    memberName: '오재민',
    surveyScore: 78,
    safetyScore: 42,
    honestyGap: 36,
    direction: 'OVERREPORT',
    riskLevel: 'WARNING',
  },
  {
    memberId: 3,
    memberName: '김민준',
    surveyScore: 80,
    safetyScore: 82,
    honestyGap: -2,
    direction: 'UNDERREPORT',
    riskLevel: 'SAFE',
  },
  {
    memberId: 4,
    memberName: '이서연',
    surveyScore: 44,
    safetyScore: 72,
    honestyGap: -28,
    direction: 'UNDERREPORT',
    riskLevel: 'CAUTION',
  },
  {
    memberId: 5,
    memberName: '박지훈',
    surveyScore: 38,
    safetyScore: 35,
    honestyGap: 3,
    direction: 'OVERREPORT',
    riskLevel: 'WARNING',
  },
  {
    memberId: 6,
    memberName: '최유진',
    surveyScore: 61,
    safetyScore: 64,
    honestyGap: -3,
    direction: 'UNDERREPORT',
    riskLevel: 'SAFE',
  },
];

export const MOCK_COMMS: CommunicationBalance[] = [
  { memberId: 1, name: '다은', memberRatio: 15, leaderRatio: 85, status: '위험' },
  { memberId: 2, name: '재민', memberRatio: 70, leaderRatio: 30, status: '적정' },
  { memberId: 3, name: '민준', memberRatio: 55, leaderRatio: 45, status: '관찰' },
  { memberId: 4, name: '서연', memberRatio: 40, leaderRatio: 60, status: '관찰' },
  { memberId: 5, name: '지훈', memberRatio: 50, leaderRatio: 50, status: '적정' },
  { memberId: 6, name: '유진', memberRatio: 52, leaderRatio: 48, status: '적정' },
];
