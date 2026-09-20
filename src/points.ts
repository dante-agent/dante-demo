// 적립금 계산 모듈
//
// 정책
//   - 기본 적립률은 결제 금액의 1%
//   - 결제 금액이 50,000원 이상이면 적립률 2%
//   - 쿠폰 할인액은 적립 대상에서 제외한다
//   - 적립금은 원 단위로 내림한다
//   - 회원 등급별 추가 적립률을 더한다

export const BASE_RATE = 0.01;
export const BONUS_RATE = 0.02;
export const BONUS_THRESHOLD = 50000;

export type MemberGrade = 'basic' | 'silver' | 'gold';

/** 회원 등급별 추가 적립률 */
export const GRADE_BONUS: Record<MemberGrade, number> = {
  basic: 0,
  silver: 0.005,
  gold: 0.01,
};

/** 적립 대상 금액을 구한다. 쿠폰 할인액은 제외한다. */
export function getEligibleAmount(subtotal: number, discount: number): number {
  return Math.max(subtotal - discount, 0);
}

/** 적립 대상 금액에 적용할 적립률을 구한다. */
export function getRewardRate(eligibleAmount: number, grade: MemberGrade): number {
  const base = eligibleAmount >= BONUS_THRESHOLD ? BONUS_RATE : BASE_RATE;
  return base + GRADE_BONUS[grade];
}

/** 적립금을 구한다. */
export function calculateRewardPoints(
  subtotal: number,
  discount: number,
  grade: MemberGrade = 'basic',
): number {
  const eligible = getEligibleAmount(subtotal, discount);
  const rate = getRewardRate(eligible, grade);
  return Math.round(eligible * rate);
}
