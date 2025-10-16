import type { Atom } from "./type";

/**
 * createAsyncAtom(asyncCallback: () => Promise<T>): Atom<T>
 * @param asyncCallback Promise를 반환하는 비동기 콜백 함수
 * @returns Atom 객체 (Suspense 대응)
 */
export const createAsyncAtom = <T>(
  asyncCallback: () => Promise<T>
): Atom<T> => {
  // 비동기 상태를 내부적으로 관리
  let asyncState: "pending" | "fulfilled" | "rejected" = "pending";
  let data: T;
  let error: Error;
  let promise: Promise<T>;

  // 구독자 관리
  const listeners = new Set<() => void>();

  // Promise 실행 함수
  const executePromise = async () => {
    asyncState = "pending";
    promise = asyncCallback()
      .then(result => {
        asyncState = "fulfilled";
        data = result;
        // 구독자들에게 알림
        for (const listener of listeners) listener();
        return result;
      })
      .catch(error_ => {
        asyncState = "rejected";
        error = error_ instanceof Error ? error_ : new Error(String(error_));
        // 구독자들에게 알림
        for (const listener of listeners) listener();
        throw error;
      });
  };

  const _getValue = (): T => {
    switch (asyncState) {
      case "pending": {
        // Suspense를 위해 Promise를 throw
        throw promise;
      }
      case "fulfilled": {
        return data;
      }
      case "rejected": {
        // Error Boundary를 위해 Error를 throw
        throw error;
      }
      default: {
        throw new Error("Invalid async state");
      }
    }
  };

  const _setValue = (newValue: T): void => {
    // 직접 값이 설정된 경우 (일반 atom처럼 동작)
    asyncState = "fulfilled";
    data = newValue;
    for (const listener of listeners) listener();
  };

  const _subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        listeners.clear();
      }
    };
  };

  // 초기 실행
  executePromise();

  return {
    _getValue,
    _setValue,
    _subscribe,
  };
};
