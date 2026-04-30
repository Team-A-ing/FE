import { useRef, useState } from 'react'

export type RecordingState = 'idle' | 'recording' | 'stopped'

export function useRecorder() {
  const [state, setState] = useState<RecordingState>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // 압축률 우수 + 브라우저 호환성 좋음
    const mimeType = 'audio/webm;codecs=opus'
    const recorder = new MediaRecorder(stream, { mimeType })
    chunksRef.current = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const recorded = new Blob(chunksRef.current, { type: mimeType })
      setBlob(recorded)
      stream.getTracks().forEach((t) => t.stop())
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setState('recording')
  }

  const stop = () => {
    mediaRecorderRef.current?.stop()
    setState('stopped')
  }

  const reset = () => {
    setBlob(null)
    setState('idle')
  }

  return { state, blob, start, stop, reset }
}
