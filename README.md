# 원자 상태 관리 라이브러리 (Atom State Management Library)

React를 위한 간단하고 효율적인 원자 상태 관리 라이브러리입니다.  
성능 최적화와 React의 Concurrent Features를 고려하여 설계했습니다.

## 🚀 주요 기능

- **원자 상태 (Atom)**: 최소 단위의 상태 관리
- **파생 상태 (Derived Atom)**: 다른 상태로부터 계산되는 상태
- **비동기 상태 (Async Atom)**: Suspense와 Error Boundary 지원
- **자동 배치 업데이트**: 마이크로태스크를 활용한 성능 최적화
- **React 18 호환**: useSyncExternalStore 활용

## 📦 설치 및 사용

```bash
pnpm install
pnpm dev
```

## 🏗️ 원자 상태(Atom) 시스템 구조

### 전체 아키텍처

```js
┌──────────────────────────────────────────────────────────────┐
│                    Atom State System                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌─────────────┐      ┌─────────────┐    ┌─────────────┐   │
│    │    Atom     │      │ DerivedAtom │    │  AsyncAtom  │   │
│    └─────────────┘      └─────────────┘    └─────────────┘   │
│            │                  │                   │          │
│            └──────────────────┼───────────────────┘          │
│                               │                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Schedule Update System                     │ │
│  │  ┌─────────────────┐  ┌────────────────────────────────┐│ │
│  │  │ pendingUpdates  │  │     Microtask Queue            ││ │
│  │  │   (Set<fn>)     │  │     Promise.resolve()          ││ │
│  │  └─────────────────┘  └────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                      React 연동                          │ │
│  │  ┌─────────────────┐  ┌────────────────────────────────┐│ │
│  │  │    useAtom      │  │    useSyncExternalStore        ││ │
│  │  │     (Hook)      │  │      (React 18)                ││ │
│  │  └─────────────────┘  └────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 핵심 구성 요소

#### 1. Atom Interface

```typescript
interface Atom<T> {
  _getValue: () => T;
  _setValue: (newValue: T) => void;
  _subscribe: (listener: () => void) => () => void;
}
```

#### 2. 상태 흐름

```
사용자 액션 → set(atom, value) → atom._setValue() → scheduleUpdate() 
→ Batch Update (Microtask Queue) → 구독자 리렌더
```

## 🎯 라이브러리 설계 고려사항과 기술적 선택

### 1. 성능 최적화 우선 설계

#### 자동 배치 업데이트 시스템

- **문제**: 동기적 상태 업데이트로 인한 과도한 리렌더링  
- **해결책**: 마이크로태스크 큐를 활용한 배치 처리  
- **선택 이유**: 우선순위가 높은 `Promise.resolve()` 사용  

```typescript
// 리렌더링을 배치 처리하여 성능을 최적화하는 핵심 함수
const scheduleUpdate = (listener: () => void) => {
  pendingUpdates.add(listener);

  if (!isFlushingUpdates) {
    isFlushingUpdates = true;
    Promise.resolve().then(() => {
      const listeners = Array.from(pendingUpdates);
      pendingUpdates.clear();
      isFlushingUpdates = false;
      listeners.forEach(listener => listener());
    });
  }
};
```

#### 메모리 효율성
- **Set 자료구조**: 중복 리스너 제거  
- **약한 참조 패턴**: 구독 해제 시 자동 메모리 정리  
- **지연 계산**: 파생 상태 필요 시점에만 계산 수행  

### 2. useAtom의 React 18 호환성 고려

#### useSyncExternalStore 채택
- **이전 방식**: `useState` + `useEffect` 조합 (tearing 문제 발생)  
- **현재 방식**: React 18의 `useSyncExternalStore` 활용  
- **장점**: Concurrent Rendering 호환, 티어링 현상 방지  

```typescript
export const useAtom = <T>(atom: Atom<T>) => {
  const value = useSyncExternalStore(
    atom._subscribe,
    atom._getValue
  );
  return value;
};
```

### 3. 타입 안전성과 개발자 경험
- 내부 API는 `_` 접두사로 은닉  
- `get`, `set`, `subscribe`, `useAtom`만 공개  
- TypeScript 기반으로 컴파일 타임 안전성 보장  

### 4. 확장성 고려 설계
- **기본 Atom** → 핵심 상태 관리  
- **파생 Atom** → 계산된 상태 관리  
- **비동기 Atom** → Suspense/에러 처리 지원  

---

## 🔍 원자 상태의 값 비교 방식과 최적화
- `Object.is()`로 정확한 동등성 검사  
- 중복 업데이트 방지 (Set 자료구조 활용)  
- 파생 상태는 지연 평가(Lazy Evaluation)  
- 구독 해제 시 자동 메모리 정리  

---

## ⚛️ React와 연동 시 발생한 문제 및 해결 방법
- 기존 방식(`useState`+`useEffect`) → tearing, 동기화 불일치 문제 발생  
- `useSyncExternalStore`로 해결 → Concurrent Rendering 대응 및 tearing 방지  

---
# simple-store-assignment
