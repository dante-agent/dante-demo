# dante-demo

Dante 데모용 저장소입니다. Dante 에이전트를 GitHub 저장소에 연결하고,
브랜치 생성부터 PR 작성·리뷰까지의 흐름을 시연하는 데 사용합니다.

## 샘플 코드

장바구니 결제 금액을 보여주는 작은 React 화면입니다.

- `src/components/CartSummary.tsx` — 상품 합계·쿠폰 할인·배송비를 계산해 결제 예정 금액을 보여준다
- `src/components/CartLineItem.tsx` — 장바구니 한 줄
- `src/App.tsx` — 샘플 장바구니를 담은 데모 화면
- `src/cart.ts` — 금액 상수와 순수 계산 함수
- `src/**/*.test.tsx` — vitest + Testing Library 기반 테스트

## 금액 정책

- 배송비는 **3,000원**
- 주문 금액이 **50,000원 이상**이면 무료배송
- 쿠폰은 배송비를 제외한 상품 금액에만 적용하며, 할인액은 상품 금액을 넘지 않는다
- 정률 쿠폰의 할인액은 원 단위로 내림한다

## 실행

```bash
npm ci
npm test
npm run typecheck
```

## 브랜치

- `main` — 기본 브랜치. 데모 PR 의 base 로 사용합니다.
