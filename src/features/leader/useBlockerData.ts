import { useState, useEffect } from 'react';
import type { BlockerCloudItem } from '@/types/blocker';

interface BlockerPoint {
  text: string;
  x: number; // 긴급도
  y: number; // 영향도
}

const MOCK_BLOCKERS: BlockerPoint[] = [
  { text: '리소스 부족', x: 40, y: 70 },
  { text: '소통 지연', x: 55, y: 65 },
  { text: '요구사항 불명확', x: 60, y: 60 },
  { text: '일정 압박', x: 75, y: 40 },
  { text: '기술 부채', x: 50, y: 45 },
  { text: '의사결정 지연', x: 70, y: 75 },
  { text: '팀 협업', x: 30, y: 50 },
];

const MOCK_BLOCKER_KEYWORDS: BlockerCloudItem[] = [
  { keyword: '업무 과부하', count: 18, mentionedBy: 7, mentionedMembers: ['김민준', '이서연', '박지훈', '최유진', '정하늘', '오세민', '한지우'] },
  { keyword: '우선순위 혼선', count: 14, mentionedBy: 6, mentionedMembers: ['김민준', '박지훈', '최유진', '문도윤', '정하늘', '윤채원'] },
  { keyword: '커뮤니케이션 부족', count: 12, mentionedBy: 5, mentionedMembers: ['이서연', '최유진', '한지우', '문도윤', '윤채원'] },
  { keyword: '일정 압박', count: 10, mentionedBy: 4, mentionedMembers: ['김민준', '박지훈', '정하늘', '오세민'] },
  { keyword: '역할 불명확', count: 8, mentionedBy: 4, mentionedMembers: ['이서연', '최유진', '문도윤', '윤채원'] },
  { keyword: '리소스 부족', count: 7, mentionedBy: 3, mentionedMembers: ['박지훈', '정하늘', '한지우'] },
  { keyword: '의사결정 지연', count: 6, mentionedBy: 3, mentionedMembers: ['김민준', '오세민', '윤채원'] },
  { keyword: '회의 피로도', count: 5, mentionedBy: 2, mentionedMembers: ['이서연', '문도윤'] },
  { keyword: '기술 부채', count: 4, mentionedBy: 2, mentionedMembers: ['박지훈', '한지우'] },
  { keyword: '문서 부족', count: 3, mentionedBy: 2, mentionedMembers: ['최유진', '정하늘'] },
];

export function useBlockerData(_teamId?: string) {
  const [points, setPoints] = useState<BlockerPoint[]>([]);
  const [keywords, setKeywords] = useState<BlockerCloudItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPoints(MOCK_BLOCKERS);
      setKeywords(MOCK_BLOCKER_KEYWORDS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { points, keywords, loading };
}
