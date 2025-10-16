import { createAtom } from "@/lib/atom/atom";
import { createDerivedAtom } from "@/lib/atom/createDerivedAtom";

// 기본 카운터 atom
export const counterAtom = createAtom<number>(0);

// 스텝 크기 atom
export const stepAtom = createAtom<number>(1);

// 파생 atom: 카운터의 제곱값
export const squaredCounterAtom = createDerivedAtom(get => {
  const count = get(counterAtom);
  return count * count;
});

// 파생 atom: 카운터가 짝수인지 여부
export const isEvenAtom = createDerivedAtom(get => {
  const count = get(counterAtom);
  return count % 2 === 0;
});

// 파생 atom: 카운터와 스텝의 합
export const counterPlusStepAtom = createDerivedAtom(get => {
  const count = get(counterAtom);
  const step = get(stepAtom);
  return count + step;
});
