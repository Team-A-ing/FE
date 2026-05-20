import { useState, useMemo, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/stores/authStore";
import apiClient from "@/api/client";
import type { ApiResponse } from "@/api/types";

interface TeamMemberApi {
  id: number;
  name: string;
  jobTitle: string;
  role: string;
}

const MOCK_MEMBERS: TeamMemberApi[] = [
  { id: 1, name: "김민준", jobTitle: "프로덕트 매니저", role: "member" },
  { id: 2, name: "이서연", jobTitle: "프론트엔드 개발자", role: "member" },
  { id: 3, name: "박지호", jobTitle: "백엔드 개발자", role: "member" },
  { id: 4, name: "최유나", jobTitle: "디자이너", role: "member" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const getDefaultDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getDefaultTime = () => {
  const now = new Date();
  const h = now.getHours();
  const min = now.getMinutes();
  if (min < 30) return `${String(h).padStart(2, "0")}:30`;
  const nextH = h + 1;
  if (nextH >= 24) return "23:30";
  return `${String(nextH).padStart(2, "0")}:00`;
};

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export default function CreateMeetingModal({ isOpen, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [members, setMembers] = useState<TeamMemberApi[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TeamMemberApi | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getDefaultDate());
  const [selectedTime, setSelectedTime] = useState<string>(getDefaultTime());
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setMembers(MOCK_MEMBERS);
      return;
    }
    if (!user?.teamId) return;
    apiClient
      .get<ApiResponse<TeamMemberApi[]>>(`/v1/teams/${user.teamId}/members`)
      .then((res) => setMembers(res.data.data))
      .catch(() => setMembers([]));
  }, [isOpen, user?.teamId]);

  const filtered = members.filter(
    (m) => m.name.includes(search) || m.jobTitle.includes(search)
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

  const canCreate = selected && !isSubmitting;

  const handleCreate = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        onCreated();
        navigate(`/leader/meeting/mock-${selected.id}`);
        return;
      }
      const res = await apiClient.post<ApiResponse<{ meetingId: number }>>(
        "/v1/meetings",
        { memberId: selected.id, scheduledAt: `${selectedDate}T${selectedTime}:00` }
      );
      onCreated();
      navigate(`/leader/meeting/${res.data.data.meetingId}`);
    } finally {
      setIsSubmitting(false);
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
                    <p className="text-xs text-gray-400">{m.jobTitle}</p>
                  </div>
                </label>
              ))}
            </div>
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
            <div className="mt-4">
              <p className="font-semibold mb-2 text-sm">미팅 시간</p>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4E62E6]"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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