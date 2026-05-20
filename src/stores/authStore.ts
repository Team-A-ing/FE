import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const storedUser = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
