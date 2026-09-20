import { describe, expect, it } from 'vitest';

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  calculateDiscount,
  calculateShipping,
  calculateSubtotal,
  calculateTotal,
} from './cart';

describe('calculateSubtotal', () => {
  it('빈 장바구니는 0원이다', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('수량을 반영해 합계를 구한다', () => {
    expect(
      calculateSubtotal([
        { price: 12000, quantity: 2 },
        { price: 5500, quantity: 3 },
      ]),
    ).toBe(40500);
  });
});

describe('calculateShipping', () => {
  it('기준 미만이면 배송비를 부과한다', () => {
    expect(calculateShipping(49999)).toBe(SHIPPING_FEE);
  });

  it('기준 금액과 정확히 같으면 무료배송이다', () => {
    expect(calculateShipping(FREE_SHIPPING_THRESHOLD)).toBe(0);
  });

  it('기준을 넘으면 무료배송이다', () => {
    expect(calculateShipping(50001)).toBe(0);
  });
});

describe('calculateDiscount', () => {
  it('쿠폰이 없으면 할인은 0원이다', () => {
    expect(calculateDiscount(30000)).toBe(0);
  });

  it('정률 쿠폰은 원 단위로 내림한다', () => {
    expect(calculateDiscount(33333, { type: 'percent', value: 10 })).toBe(3333);
  });

  it('할인액은 상품 금액을 넘지 않는다', () => {
    expect(calculateDiscount(5000, { type: 'amount', value: 8000 })).toBe(5000);
  });
});

describe('calculateTotal', () => {
  it('할인과 배송비를 모두 반영한다', () => {
    expect(
      calculateTotal([{ price: 10000, quantity: 2 }], { type: 'amount', value: 2000 }),
    ).toEqual({
      subtotal: 20000,
      discount: 2000,
      shipping: SHIPPING_FEE,
      total: 21000,
    });
  });

  it('상품 금액이 무료배송 기준과 같으면 배송비가 붙지 않는다', () => {
    const result = calculateTotal([{ price: 25000, quantity: 2 }]);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(50000);
  });
});
