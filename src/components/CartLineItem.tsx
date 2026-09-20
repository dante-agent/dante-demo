import { formatWon, type CartItem } from '../cart';

export interface CartLineItemProps {
  item: CartItem;
}

/** 장바구니 한 줄. 상품 이름·수량·줄 합계를 보여준다. */
export function CartLineItem({ item }: CartLineItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className="cart-line-item">
      <span className="cart-line-item__name">{item.name}</span>
      <span className="cart-line-item__quantity">{item.quantity}개</span>
      {item.quantity > 1 && (
        <span className="cart-line-item__unit" data-testid="unit-price">
          개당 {formatWon(item.price)}
        </span>
      )}
      <span className="cart-line-item__amount" data-testid="line-total">
        {formatWon(lineTotal)}
      </span>
    </li>
  );
}
