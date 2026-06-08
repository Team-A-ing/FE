export interface RelatedMember {
  memberId: number;
  memberName: string;
  mentionCount: number;
}

export interface BlockerPyramidItem {
  keyword: string;
  count: number;
  mentionedBy: number;
  relatedMembers?: RelatedMember[];
  actionGuide?: string;
}

export interface BlockerActionPrescription {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  dataSummary: string;
  actionGuide: string;
}

export interface BlockerPyramidData {
  blockerKeywords: BlockerPyramidItem[];
  actionPrescriptions: BlockerActionPrescription[];
}

export interface BlockerPyramidColor {
  bg: string;
  text: string;
  border: string;
}