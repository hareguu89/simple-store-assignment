/**
 * Atom 인터페이스 - 내부 구현용
 * @param T 상태 타입
 */
export interface Atom<T> {
  // 내부 메서드들 - 외부에서 직접 사용하지 않음
  _getValue: () => T;
  _setValue: (newValue: T) => void;
  _subscribe: (listener: () => void) => () => void;
}

/**
 * 비동기 상태 타입
 */
export type AsyncState<T> =
  | { status: "pending"; promise: Promise<T> }
  | { status: "fulfilled"; data: T }
  | { status: "rejected"; error: Error };
