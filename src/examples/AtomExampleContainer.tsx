import { get, set, subscribe } from "@/lib/atom/atom";
import { useAtom } from "@/lib/atom/useAtom";
import { counterAtom, stepAtom } from "@/stores/counter";
import { todoAtom } from "@/stores/todo";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const TodoExample = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useAtom(todoAtom);

  const handleClickUpdateTodo = () => {
    if (inputRef.current) {
      setTodoList([...todoList, inputRef.current.value]);
      inputRef.current.value = "";
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (inputRef.current?.value && inputRef.current.value.length > 0) {
      handleClickUpdateTodo();
    }
  };

  const handleRemoveTodo = (index: number) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setTodoList([]);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">📝 기본 TODO 예제</h3>
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          type="text"
          placeholder="할 일을 입력하세요"
          onKeyUp={handleKeyUp}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
          onClick={handleClickUpdateTodo}
        >
          추가
        </button>
        {todoList.length > 0 && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
            onClick={handleClearAll}
          >
            전체 삭제
          </button>
        )}
      </div>

      {todoList.length > 0 ? (
        <ul className="space-y-2">
          {todoList.map((todo, index) => (
            <li
              key={`${todo}-${index}`}
              className="flex items-center justify-between bg-white p-2 rounded border"
            >
              <span className="text-sm">{todo}</span>
              <button
                onClick={() => handleRemoveTodo(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">할 일이 없습니다.</p>
      )}
    </div>
  );
};

const SubscribedTodoExample = () => {
  const [subscribedTodoList, setSubscribedTodoList] = useState<string[]>([]);

  useEffect(() => {
    // 초기값 설정 - 컴포넌트 마운트 시 현재 atom 값을 가져옴
    setSubscribedTodoList(get(todoAtom));

    const unsubscribe = subscribe(todoAtom, todoList => {
      setSubscribedTodoList(todoList);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">👀 구독된 TODO 예제</h3>
      <p className="text-xs text-gray-600 mb-3">
        위의 TODO가 변경되면 자동으로 업데이트됩니다 (구독 시스템)
      </p>
      {subscribedTodoList.length > 0 ? (
        <ul className="space-y-1">
          {subscribedTodoList.map((todo, index) => (
            <li
              key={`sub-${todo}-${index}`}
              className="text-sm bg-white p-2 rounded border"
            >
              {index + 1}. {todo}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">구독된 할 일이 없습니다.</p>
      )}
    </div>
  );
};

const BatchUpdateExample = () => {
  const [counter] = useAtom(counterAtom);
  const [step] = useAtom(stepAtom);
  const renderCountRef = useRef(0);

  // 렌더링 횟수 증가 (상태 업데이트 없이)
  renderCountRef.current += 1;

  const handleBatchUpdate = () => {
    // 여러 atom을 동시에 업데이트 - 배치 처리됨
    set(counterAtom, counter + step);
    set(stepAtom, step === 10 ? 1 : step + 1);
    set(todoAtom, [...get(todoAtom), `배치 업데이트 ${Date.now()}`]);
  };

  const handleSequentialUpdate = () => {
    // 순차적으로 업데이트 - 각각 개별 렌더링 발생
    setTimeout(() => set(counterAtom, counter + 1), 0);
    setTimeout(() => set(stepAtom, step + 1), 100);
    setTimeout(
      () => set(todoAtom, [...get(todoAtom), `순차 업데이트 ${Date.now()}`]),
      200
    );
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">⚡ 배치 업데이트 예제</h3>
      <div className="mb-4 text-sm space-y-1">
        <div>
          카운터: <span className="font-bold text-purple-600">{counter}</span>
        </div>
        <div>
          스텝: <span className="font-bold text-purple-600">{step}</span>
        </div>
        <div>
          렌더링 횟수:{" "}
          <span className="font-bold text-red-600">
            {renderCountRef.current}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleBatchUpdate}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          배치 업데이트
        </button>
        <button
          onClick={handleSequentialUpdate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          순차 업데이트
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        배치 업데이트는 한 번에 처리되어 렌더링이 적게 발생합니다.
      </p>
    </div>
  );
};

const AtomExampleContainer = () => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">기본 Atom 예제</h2>
        <p className="text-gray-600">
          Atom의 기본 기능들 - 상태 관리, 구독, 배치 업데이트 등을 보여줍니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodoExample />
        <SubscribedTodoExample />
        <BatchUpdateExample />
      </div>
    </div>
  );
};

export default AtomExampleContainer;
