interface BlockerSummaryProps {
  summary: string;
}

export default function BlockerSummary({ summary }: BlockerSummaryProps) {
  return (
    <div className="rounded-xl border bg-[#F8FAFC] p-4">
      <div className="text-sm font-semibold text-purple-600 mb-2">
        🤖 Blocker 상황 요약 
      </div>
      <div className="text-sm text-gray-800 leading-relaxed">
        {summary}
      </div>
    </div>
  );
}