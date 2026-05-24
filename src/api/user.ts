import apiClient from './client';
import type { User } from '@/types/user';

interface MeApiData {
  id: string | number;
  email: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
  jobTitle?: string | null;
  teamId?: string | number | null;
  teamName?: string | null;
  inviteCode?: string | null;
}

interface MeApiResponse {
  success: boolean;
  data: MeApiData;
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<MeApiResponse>('/api/v1/users/me');
  const u = data.data;
  return {
    id: String(u.id),
    email: u.email,
    name: u.name,
    role: u.role === 'LEADER' ? 'leader' : 'member',
    jobTitle: u.jobTitle ?? undefined,
    teamId: u.teamId == null ? '' : String(u.teamId),
    teamName: u.teamName ?? undefined,
    inviteCode: u.inviteCode ?? undefined,
  };
}
