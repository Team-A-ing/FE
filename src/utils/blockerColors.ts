import type { BlockerPyramidColor } from '@/types/blocker';

const BLOCKER_RANK_PALETTE: BlockerPyramidColor[] = [
  { bg: '#FFECEF', text: '#FA5252', border: '#F8B4C0' },
  { bg: '#FEFCE8', text: '#eb9925', border: '#FDE68A' },
  { bg: '#EAF5FF', text: '#2563EB', border: '#BBD7FF' },
  { bg: '#F4F4F5', text: '#52525B', border: '#D4D4D8' },
];

export function getBlockerRankColor(rank: number) {
  if (rank === 1) return BLOCKER_RANK_PALETTE[0];
  if (rank >= 2 && rank <= 4) return BLOCKER_RANK_PALETTE[1];
  if (rank >= 5 && rank <= 7) return BLOCKER_RANK_PALETTE[2];
  return BLOCKER_RANK_PALETTE[3];
}
