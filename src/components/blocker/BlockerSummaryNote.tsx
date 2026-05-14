import Card from '@/components/ui/Card';

interface BlockerSummaryNoteProps {
  summary: string;
}

export default function BlockerSummaryNote({ summary }: BlockerSummaryNoteProps) {
  return (
    <Card className="p-4 bg-[#F8F9FA] shadow-none">
      <div className="text-m font-semibold mb-2">
        📝 Blocker 상황 요약
      </div>
      <div className="text-sm text-gray-800 leading-relaxed">
        {summary}
      </div>
    </Card>
  );
}
