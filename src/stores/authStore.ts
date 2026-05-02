import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'u1',
    name: 'Guest',
    email: 'guest@readb.io',
    role: 'leader',
    avatarInitials: 'G',
  },
  token: 'mock-token',
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
