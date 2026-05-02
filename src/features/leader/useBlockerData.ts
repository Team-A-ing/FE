import { useState, useEffect } from 'react';

interface BlockerWord {
  text: string;
  value: number;
}

const MOCK_BLOCKERS: BlockerWord[] = [
  { text: '리소스 부족', value: 80 },
  { text: '소통 지연', value: 65 },
  { text: '요구사항 불명확', value: 55 },
  { text: '일정 압박', value: 45 },
  { text: '기술 부채', value: 40 },
  { text: '의사결정 지연', value: 35 },
  { text: '팀 협업', value: 30 },
];

export function useBlockerData(_teamId?: string) {
  const [words, setWords] = useState<BlockerWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWords(MOCK_BLOCKERS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { words, loading };
}
