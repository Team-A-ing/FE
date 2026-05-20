import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { fetchMe } from '@/api/user';

export function useMe() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const { user: currentUser, token } = useAuthStore.getState();
    if (currentUser !== null || !token) return;
    fetchMe()
      .then((me) => setAuth(me, token))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
}