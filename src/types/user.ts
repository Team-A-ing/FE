export type UserRole = 'leader' | 'member'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  teamId: string
}
