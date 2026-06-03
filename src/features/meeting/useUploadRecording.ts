import { useState, useCallback } from "react";
import { uploadRecording } from "@/api/meetings";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export function useUploadRecording() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (meetingId: string, blob: Blob, durationSec: number) => {
    if (blob.size > MAX_FILE_SIZE) {
      const msg = '녹음 파일이 너무 큽니다. (25MB 초과)';
      setError(msg);
      throw new Error(msg);
    }
    setIsUploading(true);
    setError(null);
    try {
      await uploadRecording(meetingId, blob, durationSec);
    } catch {
      const msg = '녹음 파일 업로드에 실패했습니다.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, error };
}