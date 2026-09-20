// 장바구니 금액 계산에 쓰는 값과 순수 함수.
//
// 정책
//   - 배송비는 3,000원
//   - 주문 금액이 50,000원 이상이면 무료배송
//   - 쿠폰은 배송비를 제외한 상품 금액에만 적용
//
// 무료배송 판단과 결제 예정 금액은 화면 컴포넌트(components/CartSummary.tsx)가 맡는다.

export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_THRESHOLD = 50000;

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export type Coupon =
  | { type: 'percent'; value: number }
  | { type: 'amount'; value: number };

/** 상품 목록의 합계를 구한다. */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** 쿠폰 할인액을 구한다. 할인액은 상품 금액을 넘지 않는다. */
export function calculateDiscount(subtotal: number, coupon?: Coupon): number {
  if (!coupon) {
    return 0;
  }
  const raw =
    coupon.type === 'percent'
      ? Math.floor((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.min(raw, subtotal);
}

/** 금액을 화면에 쓰는 문자열로 바꾼다. 실행 환경의 로케일에 기대지 않는다. */
export function formatWon(amount: number): string {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
}
