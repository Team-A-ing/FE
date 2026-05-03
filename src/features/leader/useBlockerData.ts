import { useState, useEffect } from 'react';

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

export function useBlockerData(_teamId?: string) {
  const [points, setPoints] = useState<BlockerPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPoints(MOCK_BLOCKERS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { points, loading };
}