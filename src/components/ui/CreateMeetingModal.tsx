import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useMeetingStore } from "@/stores/meetingStore";
import type { TeamMember } from "@/types/meeting";

const MOCK_MEMBERS: TeamMember[] = [
  { id: "1", name: "김지수", email: "jisukim34@gmail.com" },
  { id: "2", name: "김하슬", email: "202011992@dgu.ac.kr" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const createMeeting = useMeetingStore((s) => s.createMeeting);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [role, setRole] = useState<"leader" | "member">("member");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(() => new Date());

  const filtered = MOCK_MEMBERS.filter(
    (m) => m.name.includes(search) || m.email.includes(search)
  );

  const calDays = useMemo(() => {
    const y = viewMonth.getFullYear();
    const mo = viewMonth.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const total = new Date(y, mo + 1, 0).getDate();
    const days: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) days.push(d);
    return days;
  }, [viewMonth]);

  const toStr = (d: number) => {
    const y = viewMonth.getFullYear();
    const m = String(viewMonth.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-${String(d).padStart(2, "0")}`;
  };

  const canCreate = selected && selectedDate;

  const handleCreate = () => {
    if (selected && selectedDate) {
      const meeting = createMeeting(selected, role, selectedDate);
      onCreated(); // 부모(App.tsx)의 onClose 등을 실행
      navigate(`/leader/meeting/${meeting.id}`); // 생성 즉시 상세 페이지로 이동
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[720px] max-h-[90vh] overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">1on1 미팅 만들기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* 왼쪽: 멤버 선택 */}
          <div>
            <p className="font-semibold mb-3">미팅 상대는 누구인가요?</p>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:border-[#4E62E6]"
              placeholder="이름이나 이메일 주소를 입력해주세요."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-2 max-h-[180px] overflow-auto mb-6">
              {filtered.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="member"
                    checked={selected?.id === m.id}
                    onChange={() => setSelected(m)}
                    className="accent-[#5F74FA]"
                  />
                  <div className="w-8 h-8 rounded-full bg-[#5F74FA] flex items-center justify-center text-white text-xs font-bold">
                    {m.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </label>
              ))}
            </div>

            <p className="font-semibold mb-3">리더를 선택해주세요.</p>
            <div className="flex gap-3">
              {(["leader", "member"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
                    role === r
                      ? "border-[#4E62E6] bg-[#5F74FA]/10 text-[#5F74FA]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="hidden"
                  />
                  {r === "leader" ? "나" : "상대방"}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ※ 리더는 시작·종료 권한과 상대의 업무 몰입도 및 상황 만족도 체크, 1on1 분석
              인사이트를 제공받게 됩니다.
            </p>
          </div>

          {/* 오른쪽: 캘린더 */}
          <div>
            <p className="font-semibold mb-3">미팅 날짜를 정해주세요.</p>
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))
                  }
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  &lt;
                </button>
                <span className="font-medium text-sm">
                  {viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월
                </span>
                <button
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))
                  }
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-sm gap-y-2">
                {calDays.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />;
                  const ds = toStr(day);
                  const isSel = selectedDate === ds;
                  const isSun = i % 7 === 0;
                  const isSat = i % 7 === 6;
                  return (
                    <button
                      key={ds}
                      onClick={() => setSelectedDate(ds)}
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center transition-colors
                        ${isSel ? "bg-[#5F74FA] text-white" : "hover:bg-gray-100"}
                        ${!isSel && isSun ? "text-red-400" : ""}
                        ${!isSel && isSat ? "text-blue-400" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className={`px-6 py-2.5 rounded-lg text-sm text-white transition-colors ${
              canCreate ? "bg-[#5F74FA] hover:bg-[#4E62E6]" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            미팅 만들기
          </button>
        </div>
      </div>
    </div>
  );
}