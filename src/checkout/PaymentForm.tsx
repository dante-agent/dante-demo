import { useState, type FormEvent } from 'react';

import { formatWon } from '../cart';

export type PaymentMethod = 'card' | 'transfer' | 'easy';

export interface PaymentFormProps {
  amount: number;
  onSubmit?: (method: PaymentMethod) => void;
}

const CARD_NUMBER_LENGTH = 16;

const METHOD_LABELS: Record<PaymentMethod, string> = {
  card: '신용·체크카드',
  transfer: '계좌이체',
  easy: '간편결제',
};

/** 입력값에서 숫자만 남긴다. 공백과 하이픈을 허용하려고. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** 유효기간(MM/YY) 검증. 통과하면 null. */
export function validateExpiry(value: string): string | null {
  const matched = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!matched) {
    return '유효기간은 MM/YY 형식으로 입력해 주세요.';
  }
  const month = Number(matched[1]);
  if (month < 1 || month > 12) {
    return '월은 01 에서 12 사이여야 합니다.';
  }
  return null;
}

/** 카드 결제일 때만 검사한다. 다른 수단은 입력값이 없다. */
function cardError(method: PaymentMethod, cardNumber: string, expiry: string): string | null {
  if (method !== 'card') {
    return null;
  }
  const digits = digitsOnly(cardNumber);
  if (digits.length === 0) {
    return '카드번호를 입력해 주세요.';
  }
  if (digits.length !== CARD_NUMBER_LENGTH) {
    return `카드번호는 ${CARD_NUMBER_LENGTH}자리입니다.`;
  }
  return validateExpiry(expiry);
}

/**
 * 결제 수단을 고르고 결제를 시작하는 폼.
 *
 * 카드일 때만 카드번호·유효기간을 받고, 검증을 통과해야 결제 버튼이 열린다.
 */
export function PaymentForm({ amount, onSubmit }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const error = cardError(method, cardNumber, expiry);
  const payable = amount > 0 && error === null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!payable) {
      return;
    }
    onSubmit?.(method);
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit} aria-label="결제 수단">
      <fieldset className="payment-form__methods">
        <legend>결제 수단</legend>
        {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="payment-method"
              value={value}
              checked={method === value}
              onChange={() => setMethod(value)}
            />
            {METHOD_LABELS[value]}
          </label>
        ))}
      </fieldset>

      {method === 'card' && (
        <div className="payment-form__card">
          <label>
            카드번호
            <input
              inputMode="numeric"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
            />
          </label>
          <label>
            유효기간
            <input
              placeholder="MM/YY"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
            />
          </label>
        </div>
      )}

      {error !== null && (
        <p className="payment-form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={!payable}>
        {formatWon(amount)} 결제하기
      </button>
    </form>
  );
}
