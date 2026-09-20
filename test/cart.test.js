import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  calculateDiscount,
  calculateShipping,
  calculateSubtotal,
  calculateTotal,
} from '../src/cart.js';

describe('calculateSubtotal', () => {
  it('빈 장바구니는 0원이다', () => {
    assert.equal(calculateSubtotal([]), 0);
  });

  it('수량을 반영해 합계를 구한다', () => {
    const items = [
      { price: 12000, quantity: 2 },
      { price: 5500, quantity: 3 },
    ];
    assert.equal(calculateSubtotal(items), 40500);
  });
});

describe('calculateShipping', () => {
  it('기준 미만이면 배송비를 부과한다', () => {
    assert.equal(calculateShipping(49999), SHIPPING_FEE);
  });

  it('기준 금액과 정확히 같으면 무료배송이다', () => {
    assert.equal(calculateShipping(FREE_SHIPPING_THRESHOLD), 0);
  });

  it('기준을 넘으면 무료배송이다', () => {
    assert.equal(calculateShipping(50001), 0);
  });
});

describe('calculateDiscount', () => {
  it('쿠폰이 없으면 할인은 0원이다', () => {
    assert.equal(calculateDiscount(30000), 0);
  });

  it('정률 쿠폰은 원 단위로 내림한다', () => {
    assert.equal(calculateDiscount(33333, { type: 'percent', value: 10 }), 3333);
  });

  it('할인액은 상품 금액을 넘지 않는다', () => {
    assert.equal(calculateDiscount(5000, { type: 'amount', value: 8000 }), 5000);
  });
});

describe('calculateTotal', () => {
  it('할인과 배송비를 모두 반영한다', () => {
    const items = [{ price: 10000, quantity: 2 }];
    const result = calculateTotal(items, { type: 'amount', value: 2000 });
    assert.deepEqual(result, {
      subtotal: 20000,
      discount: 2000,
      shipping: SHIPPING_FEE,
      total: 21000,
    });
  });

  it('상품 금액이 무료배송 기준과 같으면 배송비가 붙지 않는다', () => {
    const items = [{ price: 25000, quantity: 2 }];
    const result = calculateTotal(items);
    assert.equal(result.shipping, 0);
    assert.equal(result.total, 50000);
  });
});
