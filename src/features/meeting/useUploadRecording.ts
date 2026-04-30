import { useState } from 'react'
import { meetingApi } from '@/api/meeting.api'

export function useUploadRecording() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (meetingId: string, blob: Blob) => {
    // Whisper API 25MB 제한 — 클라이언트 사전 검증
    const MB = 1024 * 1024
    if (blob.size > 25 * MB) {
      setError('녹음 파일이 25MB를 초과합니다. 미팅 시간을 줄이거나 BE 분할 처리를 확인하세요.')
      return null
    }

    setIsUploading(true)
    setError(null)
    try {
      const res = await meetingApi.uploadRecording(meetingId, blob)
      return res.data.data
    } catch {
      setError('업로드에 실패했습니다. 네트워크 상태를 확인해주세요.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error }
}
