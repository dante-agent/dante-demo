import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartSummary } from './CartSummary';
import type { CartItem, Coupon } from '../cart';

/** 상품 금액이 정확히 `subtotal` 이 되는 장바구니. */
function cartWorth(subtotal: number): CartItem[] {
  return [{ name: '샘플 상품', price: subtotal, quantity: 1 }];
}

function renderSummary(subtotal: number, coupon?: Coupon) {
  return render(<CartSummary items={cartWorth(subtotal)} coupon={coupon} />);
}

describe('CartSummary', () => {
  it('상품 금액과 결제 예정 금액을 보여준다', () => {
    renderSummary(20000);

    expect(screen.getByTestId('subtotal')).toHaveTextContent('20,000원');
    expect(screen.getByTestId('total')).toHaveTextContent('23,000원');
  });

  it('무료배송 기준 미만이면 배송비를 부과한다', () => {
    renderSummary(49000);

    expect(screen.getByTestId('shipping')).toHaveTextContent('3,000원');
  });

  it('상품 금액이 무료배송 기준과 정확히 같으면 무료배송이다', () => {
    renderSummary(50000);

    expect(screen.getByTestId('shipping')).toHaveTextContent('무료');
    expect(screen.getByTestId('total')).toHaveTextContent('50,000원');
  });

  it('무료배송 기준을 넘으면 무료배송이다', () => {
    renderSummary(51000);

    expect(screen.getByTestId('shipping')).toHaveTextContent('무료');
  });

  it('쿠폰 할인을 결제 예정 금액에 반영한다', () => {
    renderSummary(20000, { type: 'amount', value: 2000 });

    expect(screen.getByTestId('discount')).toHaveTextContent('-2,000원');
    expect(screen.getByTestId('total')).toHaveTextContent('21,000원');
  });
});
