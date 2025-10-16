import { createAtom, get, subscribe } from "./atom";
import type { Atom } from "./type";

/**
 * createDerivedAtom(get => get(atomA) + get(atomB)) 형식으로 계산된 상태 생성
 * - 자동 의존성 추적
 * - 반응형 업데이트
 * @param selector 계산 함수
 * @returns 파생된 Atom
 */
export const createDerivedAtom = <T>(
  selector: (get: <U>(atom: Atom<U>) => U) => T
): Atom<T> => {
  // 의존성 추적을 위한 Set
  const dependencies = new Set<Atom<any>>();

  // 마지막 계산값 캐싱 (메모이제이션)
  let cachedValue: T;

  // 의존성을 추적
  const trackingGet = <U>(atom: Atom<U>): U => {
    dependencies.add(atom);
    return get(atom);
  };

  // 값을 계산하는 함수
  const calculateValue = (): T => {
    dependencies.clear(); // 이전 의존성 초기화
    return selector(trackingGet);
  };

  // 초기값 계산하여 파생 atom 생성
  const derivedAtom = createAtom<T>(calculateValue());
  cachedValue = get(derivedAtom);

  // 의존성들을 구독하여 자동 업데이트
  for (const dep of dependencies) {
    subscribe(dep, () => {
      // 의존성이 변경되면 재계산
      const newValue = calculateValue();

      // 값이 실제로 변경된 경우에만 업데이트
      if (!Object.is(cachedValue, newValue)) {
        cachedValue = newValue;
        derivedAtom._setValue(newValue);
      }
    });
  }

  return derivedAtom;
};
