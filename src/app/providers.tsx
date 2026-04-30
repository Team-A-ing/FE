/**
 * 전역 프로바이더 조합 (FE2 초기 작성)
 * - ThemeProvider: 다크/라이트 모드 대응을 위해 추후 추가 가능
 * - 현재는 RouterProvider 외 추가 레이어 없음
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
