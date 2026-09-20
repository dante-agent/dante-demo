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

  it('수량을 곱한 줄 합계를 보여준다', () => {
    renderLine();

    expect(screen.getByTestId('line-total')).toHaveTextContent('42,000원');
  });
});
