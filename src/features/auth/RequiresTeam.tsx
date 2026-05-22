import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  children: ReactNode;
}

export default function RequiresTeam({ children }: Props) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return null;
  if (user.teamId === '') {
    return <Navigate to={user.role === 'leader' ? '/leader/team-setup' : '/member/team-join'} replace />;
  }

  return <>{children}</>;
}
