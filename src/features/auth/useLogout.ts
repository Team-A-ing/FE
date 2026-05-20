import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return { logout };
}