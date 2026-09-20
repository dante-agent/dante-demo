import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartLineItem } from './CartLineItem';

function renderLine() {
  return render(
    <ul>
      <CartLineItem item={{ name: '드립 서버', price: 14000, quantity: 3 }} />
    </ul>,
  );
}

describe('CartLineItem', () => {
  it('상품 이름과 수량을 보여준다', () => {
    renderLine();

    expect(screen.getByText('드립 서버')).toBeInTheDocument();
    expect(screen.getByText('3개')).toBeInTheDocument();
  });

  it('수량이 2개 이상이면 단가를 같이 보여준다', () => {
    renderLine();

    expect(screen.getByTestId('unit-price')).toHaveTextContent('개당 14,000원');
  });

  it('수량이 1개면 단가를 보여주지 않는다', () => {
    render(
      <ul>
        <CartLineItem item={{ name: '드립 서버', price: 14000, quantity: 1 }} />
      </ul>,
    );

    expect(screen.queryByTestId('unit-price')).toBeNull();
  });

  it('수량을 곱한 줄 합계를 보여준다', () => {
    renderLine();

    expect(screen.getByTestId('line-total')).toHaveTextContent('42,000원');
  });
});
