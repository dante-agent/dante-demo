import { CartSummary } from './components/CartSummary';
import type { CartItem, Coupon } from './cart';

const SAMPLE_ITEMS: CartItem[] = [
  { name: '에티오피아 원두 500g', price: 18000, quantity: 2 },
  { name: '드립 서버', price: 14000, quantity: 1 },
];

const SAMPLE_COUPON: Coupon = { type: 'percent', value: 10 };

/** 데모 화면. 샘플 장바구니를 요약 컴포넌트에 넘긴다. */
export default function App() {
  return (
    <main className="app">
      <h1>장바구니</h1>
      <CartSummary items={SAMPLE_ITEMS} coupon={SAMPLE_COUPON} />
    </main>
  );
}
