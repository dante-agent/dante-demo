import { describe, expect, it } from 'vitest';

import {
  calculateDiscount,
  calculateSubtotal,
  formatWon,
  type CartItem,
} from './cart';

const ITEMS: CartItem[] = [
  { name: '원두', price: 12000, quantity: 2 },
  { name: '필터', price: 5500, quantity: 3 },
];

describe('calculateSubtotal', () => {
  it('빈 장바구니는 0원이다', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('수량을 반영해 합계를 구한다', () => {
    expect(calculateSubtotal(ITEMS)).toBe(40500);
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

describe('formatWon', () => {
  it('세 자리마다 쉼표를 넣는다', () => {
    expect(formatWon(50000)).toBe('50,000원');
    expect(formatWon(0)).toBe('0원');
  });
});
