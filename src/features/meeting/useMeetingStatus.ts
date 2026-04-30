import { useEffect, useRef, useState } from 'react'
import { meetingApi } from '@/api/meeting.api'
import type { MeetingStatus } from '@/types/meeting'

const POLL_INTERVAL = 3_000   // 3초
const POLL_TIMEOUT  = 3 * 60 * 1_000  // 3분

export function useMeetingStatus(meetingId: string | null) {
  const [status, setStatus] = useState<MeetingStatus>('analyzing')
  const [progress, setProgress] = useState<number>(0)
  const [isTimeout, setIsTimeout] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    if (!meetingId) return

    const poll = async () => {
      if (Date.now() - startedAt.current > POLL_TIMEOUT) {
        clearInterval(intervalRef.current!)
        setIsTimeout(true)
        return
      }

      try {
        const res = await meetingApi.getStatus(meetingId)
        const { status: s, progress: p } = res.data.data
        setStatus(s)
        if (p !== undefined) setProgress(p)

        if (s === 'done' || s === 'error') {
          clearInterval(intervalRef.current!)
        }
      } catch {
        // 네트워크 오류는 무시하고 계속 폴링
      }
    }

    intervalRef.current = setInterval(poll, POLL_INTERVAL)
    poll() // 즉시 1회 호출

    return () => clearInterval(intervalRef.current!)
  }, [meetingId])

  return { status, progress, isTimeout }
}
