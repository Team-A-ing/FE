// 자주 쓰이는 전체 문구 매핑 (자연스러운 표현 우선)
export const FEEDBACK_TERM_MAP: Record<string, string> = {
  'Vulnerability 부족': '솔직한 표현이 적었어요',
  '더 많은 Vulnerability 발화를': '솔직하게 표현',
  'Constructive Dissent 부족': '건설적 의견이 적었어요',
  '적극적인 Initiative 발휘': '자발적 제안이 활발했어요',
};

// 내부 분석 지표/용어 → 일상 언어. 저장된 과거 피드백이나 모델이 흘린 용어를
// 렌더 시점에 치환하기 위한 일반 매핑. 긴 표현부터 치환되도록 정렬해 사용한다.
const INTERNAL_TERM_MAP: Record<string, string> = {
  'Constructive Dissent': '건설적인 의견 제시',
  'constructiveDissent': '건설적인 의견 제시',
  'Safety Score': '심리적 안전감',
  'SafetyScore': '심리적 안전감',
  'Honesty Gap': '자기 평가와 실제 대화의 차이',
  'HonestyGap': '자기 평가와 실제 대화의 차이',
  'Speech Act': '발화',
  'Vulnerability': '솔직한 표현',
  'Initiative': '자발적 제안',
  OVERREPORT: '실제보다 높게 평가함',
  UNDERREPORT: '실제보다 낮게 평가함',
  baseline: '평소 기준',
};

export function mapFeedbackTitle(title: string): string {
  return FEEDBACK_TERM_MAP[title] ?? title;
}

// 긴 키부터 치환해 "Constructive Dissent"가 "Initiative" 등 부분 치환에 깨지지 않도록 한다.
const SORTED_TERMS = Object.entries(INTERNAL_TERM_MAP).sort(
  ([a], [b]) => b.length - a.length
);

export function replaceTermsInText(text: string): string {
  const withPhrases = Object.entries(FEEDBACK_TERM_MAP).reduce(
    (result, [from, to]) => result.split(from).join(to),
    text
  );
  return SORTED_TERMS.reduce(
    (result, [from, to]) => result.split(from).join(to),
    withPhrases
  );
}
