export interface BlockerPyramidItem {
  keyword: string;
  count: number;
  mentionedBy: number;
  mentionedMembers?: string[];
}

export interface BlockerPyramidColor {
  bg: string;
  text: string;
  border: string;
}
