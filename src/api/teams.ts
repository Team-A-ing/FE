import apiClient from './client';
import type { ApiResponse } from './types';

interface CreateTeamApiResponse {
  id: string | number;
  name: string;
  leaderId: string | number;
  leaderName: string;
  inviteCode: string;
}

interface JoinTeamApiResponse {
  teamId: string | number;
  teamName: string;
}

export interface CreateTeamResult {
  id: string;
  name: string;
  inviteCode: string;
}

export interface JoinTeamResult {
  teamId: string;
  teamName: string;
}

export async function createTeam(name: string): Promise<CreateTeamResult> {
  const res = await apiClient.post<ApiResponse<CreateTeamApiResponse>>('/api/v1/teams', { name });
  const d = res.data.data;
  return { id: String(d.id), name: d.name, inviteCode: d.inviteCode };
}

export async function joinTeam(inviteCode: string): Promise<JoinTeamResult> {
  const res = await apiClient.post<ApiResponse<JoinTeamApiResponse>>('/api/v1/teams/join', { inviteCode });
  const d = res.data.data;
  return { teamId: String(d.teamId), teamName: d.teamName };
}

export interface TeamMember {
  id: string;
  name: string;
  jobTitle?: string;
  role: 'leader' | 'member';
}

interface TeamMemberApiData {
  id: string | number;
  name: string;
  jobTitle?: string | null;
  role: 'LEADER' | 'MEMBER';
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const res = await apiClient.get<ApiResponse<TeamMemberApiData[]>>(`/api/v1/teams/${teamId}/members`);
  return res.data.data.map((m) => ({
    id: String(m.id),
    name: m.name,
    jobTitle: m.jobTitle ?? undefined,
    role: m.role === 'LEADER' ? 'leader' : 'member',
  }));
}
