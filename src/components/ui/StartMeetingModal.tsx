import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function StartMeetingModal({ isOpen, onClose, onStart }: Props) {
  const [consent, setConsent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[480px] p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">미팅을 시작하시겠습니까?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          미팅이 끝나면 회의록과 내용 요약을 자동으로 생성해드려요.
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <span className="font-medium text-sm">녹음 기능</span>
          </div>
          <div className="bg-[#5F74FA] text-white text-xs font-bold px-3 py-1 rounded-full">
            ON
          </div>
        </div>
        
        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="accent-[#5F74FA] w-4 h-4"
          />
          <span className="text-sm text-gray-600">상대방의 녹음 동의를 구했어요.</span>
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => {
              onStart();
              onClose();
            }}
            disabled={!consent}
            className={`px-6 py-2.5 rounded-lg text-sm text-white transition-colors ${
              consent ? "bg-[#5F74FA] hover:bg-[#4E62E6]" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            미팅 시작
          </button>
        </div>
      </div>
    </div>
  );
}