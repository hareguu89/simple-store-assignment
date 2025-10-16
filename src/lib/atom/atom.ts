import type { Atom } from "./type";

// 자동 배치 업데이트 시스템
const pendingUpdates = new Set<() => void>();
let isFlushingUpdates = false;

const scheduleUpdate = (listener: () => void) => {
  pendingUpdates.add(listener);

  if (!isFlushingUpdates) {
    isFlushingUpdates = true;

    // 마이크로태스크 큐에 넣어서 현재 실행 스택이 끝난 후 일괄 처리
    Promise.resolve().then(() => {
      const listeners = [...pendingUpdates];
      pendingUpdates.clear();
      isFlushingUpdates = false;

      // 중복 제거된 리스너들 실행
      for (const listener of listeners) {
        listener();
      }
    });
  }
};

/**
 * createAtom(initialValue: T): Atom<T>
 * @param initialValue 초기값
 * @returns Atom 객체
 */
export const createAtom = <T>(initialValue: T): Atom<T> => {
  // 현재 상태를 저장하는 변수
  let state = initialValue;

  // Atom 구독자 관리
  const listeners = new Set<() => void>();

  const _getValue = (): T => state;

  const _setValue = (newValue: T): void => {
    // 값이 실제로 변경된 경우에만 알림 (얕은 비교)
    if (!Object.is(state, newValue)) {
      state = newValue;

      // 구독자들을 자동 배치 시스템에 등록
      for (const listener of listeners) {
        scheduleUpdate(listener);
      }
    }
  };

  const _subscribe = (listener: () => void): (() => void) => {
    // 새로운 listener를 이 Atom의 구독자 목록에 추가
    listeners.add(listener);

    // (GC-friendly cleanup)
    return () => {
      listeners.delete(listener);

      // 구독자가 없으면 메모리 해제
      if (listeners.size === 0) {
        listeners.clear();
      }
    };
  };

  return {
    _getValue,
    _setValue,
    _subscribe,
  };
};

/**
 * get(atom: Atom<T>): T
 * @param atom 값을 읽을 Atom
 * @returns atom의 현재 상태 값
 */
export const get = <T>(atom: Atom<T>): T => {
  return atom._getValue();
};

/**
 * set(atom: Atom<T>, newValue: T): void
 * @param atom 값을 설정할 Atom
 * @param newValue 새로운 값
 */
export const set = <T>(atom: Atom<T>, newValue: T): void => {
  atom._setValue(newValue);
};

/**
 * @param atom 구독할 Atom
 * @param callback 값 변경 시 호출될 콜백 (새 값을 매개변수로 받음)
 * @returns unsubscribe 함수
 */
export const subscribe = <T>(
  atom: Atom<T>,
  callback: (val: T) => void
): (() => void) => {
  return atom._subscribe(() => {
    callback(atom._getValue()); // 새 값을 콜백에 전달
  });
};
