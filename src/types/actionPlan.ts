export interface TeamActionItem {
  planId: number;
  content: string;
}

export interface MemberActionItems {
  memberId: number;
  memberName: string;
  round: number;
  plans: TeamActionItem[];
}
