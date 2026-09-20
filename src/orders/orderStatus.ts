// 주문 상태 전이 규칙.
//
// 정책
//   - 결제가 끝나기 전에는 배송을 시작하지 않는다
//   - 배송이 시작되면 취소할 수 없고, 반품으로만 되돌린다
//   - 환불은 결제가 끝난 뒤에만 할 수 있다

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

const LABELS: Record<OrderStatus, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '상품 준비중',
  shipped: '배송중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
  returned: '반품 접수',
  refunded: '환불 완료',
};

/** 화면에 쓰는 상태 이름. */
export function statusLabel(status: OrderStatus): string {
  return LABELS[status];
}

/** 이 상태에서 갈 수 있는 다음 상태들. */
export function nextStatuses(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case 'pending':
      return ['paid', 'cancelled'];
    case 'paid':
      return ['preparing', 'cancelled', 'refunded'];
    case 'preparing':
      return ['shipped', 'cancelled', 'refunded'];
    case 'shipped':
      return ['delivered', 'returned'];
    case 'delivered':
      return ['returned'];
    case 'returned':
      return ['refunded'];
    case 'cancelled':
    case 'refunded':
      return [];
  }
}

/** 두 상태 사이의 전이가 허용되는지. */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) {
    return false;
  }
  return nextStatuses(from).includes(to);
}

/** 더 이상 바뀌지 않는 상태인지. */
export function isFinal(status: OrderStatus): boolean {
  return nextStatuses(status).length === 0;
}

/** 주문을 취소할 수 있는지. 배송이 시작되면 취소가 아니라 반품이다. */
export function canCancel(status: OrderStatus): boolean {
  return canTransition(status, 'cancelled');
}

/** 환불할 수 있는지. 결제가 끝나야 환불할 금액이 생긴다. */
export function canRefund(status: OrderStatus): boolean {
  if (status === 'pending') {
    return false;
  }
  return canTransition(status, 'refunded');
}
