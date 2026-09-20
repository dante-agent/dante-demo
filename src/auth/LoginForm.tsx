import { useState, type FormEvent } from 'react';

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  /** 서버 응답을 기다리는 중이면 입력과 버튼을 잠근다. */
  pending?: boolean;
  /** 로그인 실패 같은 서버 쪽 메시지. */
  serverError?: string | null;
}

const MIN_PASSWORD_LENGTH = 8;

/** 이메일 형식 검증. 통과하면 null. */
export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return '이메일을 입력해 주세요.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return '이메일 형식이 올바르지 않습니다.';
  }
  return null;
}

/** 비밀번호 검증. 통과하면 null. */
export function validatePassword(value: string): string | null {
  if (value.length === 0) {
    return '비밀번호를 입력해 주세요.';
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`;
  }
  return null;
}

/**
 * 이메일·비밀번호 로그인 폼.
 *
 * 한 번이라도 제출을 누른 뒤에야 검증 메시지를 보여준다 — 입력하는 중에 빨간 글씨가
 * 먼저 뜨면 읽기 불편하다.
 */
export function LoginForm({ onSubmit, pending = false, serverError = null }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const message = submitted ? (emailError ?? passwordError ?? serverError) : serverError;
  const canSubmit = !pending && emailError === null && passwordError === null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) {
      return;
    }
    onSubmit?.(email.trim(), password);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} aria-label="로그인">
      <label>
        이메일
        <input
          type="email"
          value={email}
          disabled={pending}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label>
        비밀번호
        <input
          type="password"
          value={password}
          disabled={pending}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {message !== null && (
        <p className="login-form__error" role="alert">
          {message}
        </p>
      )}

      <button type="submit" disabled={pending}>
        {pending ? '로그인 중' : '로그인'}
      </button>
    </form>
  );
}
