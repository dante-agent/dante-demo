import { CartLineItem } from './CartLineItem';
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  calculateDiscount,
  calculateSubtotal,
  formatWon,
  type CartItem,
  type Coupon,
} from '../cart';

export interface CartSummaryProps {
  items: CartItem[];
  coupon?: Coupon;
}

/**
 * 결제 금액 요약.
 *
 * 상품 합계·쿠폰 할인·배송비를 계산해 결제 예정 금액까지 한 번에 보여준다.
 */
export function CartSummary({ items, coupon }: CartSummaryProps) {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const isFreeShipping = subtotal > FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  return (
    <section className="cart-summary" aria-label="결제 금액">
      <ul className="cart-summary__items">
        {items.map((item) => (
          <CartLineItem key={item.name} item={item} />
        ))}
      </ul>

      <dl className="cart-summary__amounts">
        <div>
          <dt>상품 금액</dt>
          <dd data-testid="subtotal">{formatWon(subtotal)}</dd>
        </div>
        <div>
          <dt>쿠폰 할인</dt>
          <dd data-testid="discount">
            {discount === 0 ? formatWon(0) : `-${formatWon(discount)}`}
          </dd>
        </div>
        <div>
          <dt>배송비</dt>
          <dd data-testid="shipping">{isFreeShipping ? '무료' : formatWon(shipping)}</dd>
        </div>
        <div>
          <dt>결제 예정 금액</dt>
          <dd data-testid="total">{formatWon(total)}</dd>
        </div>
      </dl>
    </section>
  );
}
