import { useCallback, useSyncExternalStore } from "react";
import type { Atom } from "./type";

/**
 * @description 상태값을 읽고, setter를 통해 값을 변경할 수 있음
 * @param atom atom 객체
 * @returns [state, setter]
 */
export const useAtom = <T>(atom: Atom<T>): [T, (val: T) => void] => {
  // 현재 값 구독
  const value = useSyncExternalStore(
    atom._subscribe, // atom의 내부 구독 함수
    atom._getValue // atom의 내부 getValue로 상태 읽기
    // ssr 사용할떈 ssr 대응을 위해 getServerSnapshot 추가
  );

  // setter 함수 (React Hook 스타일)
  const setValue = useCallback(
    (newValue: T) => {
      atom._setValue(newValue);
    },
    [atom]
  );

  return [value, setValue];
};
