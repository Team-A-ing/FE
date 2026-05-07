interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEnd: () => void;
}

export default function EndMeetingModal({ isOpen, onClose, onEnd }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">미팅 종료 안내</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-8">원온원 미팅을 종료하시겠어요?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onEnd}
            className="px-6 py-2.5 rounded-lg text-sm text-white bg-[#5F74FA] hover:bg-[#4E62E6]"
          >
            1on1 미팅 종료하기
          </button>
        </div>
      </div>
    </div>
  );
}