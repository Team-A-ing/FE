import { useState, useCallback } from "react";

export function useUploadRecording() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (meetingId: string, blob: Blob) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, `meeting-${meetingId}.webm`);
      formData.append("meetingId", meetingId);

      // TODO: 실제 API 엔드포인트로 교체
      // await apiClient.post("/meetings/upload", formData);

      console.log("[useUploadRecording] uploaded", meetingId, blob.size, "bytes");
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading };
}