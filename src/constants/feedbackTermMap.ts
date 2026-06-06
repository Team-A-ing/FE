export const FEEDBACK_TERM_MAP: Record<string, string> = {
  'Vulnerability 부족': '솔직한 표현이 적었어요',
  '더 많은 Vulnerability 발화를': '솔직하게 표현',
  'Constructive Dissent 부족': '건설적 의견이 적었어요',
  '적극적인 Initiative 발휘': '자발적 제안이 활발했어요',
};

export function mapFeedbackTitle(title: string): string {
  return FEEDBACK_TERM_MAP[title] ?? title;
}

export function replaceTermsInText(text: string): string {
  return Object.entries(FEEDBACK_TERM_MAP).reduce(
    (result, [from, to]) => result.split(from).join(to),
    text
  );
}
