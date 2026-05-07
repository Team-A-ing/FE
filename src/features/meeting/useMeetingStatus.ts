import { useEffect, useRef } from "react";
import { useMeetingStore } from "@/stores/meetingStore";

/**
 * 분석 상태를 폴링하여 "analyzing" → "completed" 전환을 감지
 * TODO: 실제 API 폴링으로 교체
 */
export function useMeetingStatus(meetingId: string | null) {
  const updateStatus = useMeetingStore((s) => s.updateMeetingStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!meetingId) return;

    // 데모용: 20초 후 completed 전환 (실제로는 BE 폴링)
    intervalRef.current = setInterval(() => {
      // const res = await apiClient.get(`/meetings/${meetingId}/status`);
      // if (res.data.status === "completed") {
      //   updateStatus(meetingId, "completed");
      //   clearInterval(intervalRef.current!);
      // }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [meetingId, updateStatus]);
}