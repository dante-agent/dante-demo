// 장바구니 금액 계산 모듈
//
// 정책
//   - 배송비는 3,000원
//   - 주문 금액이 50,000원 이상이면 무료배송
//   - 쿠폰은 배송비를 제외한 상품 금액에만 적용

export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_THRESHOLD = 50000;

export interface CartItem {
  price: number;
  quantity: number;
}

export type Coupon =
  | { type: 'percent'; value: number }
  | { type: 'amount'; value: number };

export interface CartTotal {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

/** 상품 목록의 합계를 구한다. */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** 상품 금액에 따른 배송비를 구한다. */
export function calculateShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_FEE;
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

/** 최종 결제 금액을 구한다. */
export function calculateTotal(items: CartItem[], coupon?: Coupon): CartTotal {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const shipping = calculateShipping(subtotal);
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}
