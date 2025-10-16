import { useAtom } from "@/lib/atom/useAtom";
import {
  counterAtom,
  counterPlusStepAtom,
  isEvenAtom,
  squaredCounterAtom,
  stepAtom,
} from "@/stores/counter";

const DerivedAtomExampleContainer = () => {
  const [counter, setCounter] = useAtom(counterAtom);
  const [step, setStep] = useAtom(stepAtom);
  const [squared] = useAtom(squaredCounterAtom);
  const [isEven] = useAtom(isEvenAtom);
  const [counterPlusStep] = useAtom(counterPlusStepAtom);

  const handleIncrement = () => setCounter(counter + step);
  const handleDecrement = () => setCounter(counter - step);
  const handleReset = () => setCounter(0);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">파생 Atom 예제</h2>
        <p className="text-gray-600">
          기본 atom이 변경되면 파생된 atom들이 자동으로 재계산됩니다
        </p>
      </div>

      {/* 현재 값 표시 */}
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{counter}</div>
        <div className="text-sm text-gray-600">현재 카운터 값</div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleDecrement}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          -{step}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          리셋
        </button>
        <button
          onClick={handleIncrement}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          +{step}
        </button>
      </div>

      {/* 스텝 크기 선택 */}
      <div className="flex justify-center items-center gap-2">
        <span className="text-sm text-gray-600">스텝:</span>
        {[1, 2, 5, 10].map(stepValue => (
          <button
            key={stepValue}
            onClick={() => setStep(stepValue)}
            className={`w-8 h-8 rounded-md text-sm transition-colors ${
              step === stepValue
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {stepValue}
          </button>
        ))}
      </div>

      {/* 파생된 상태들 */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-center">
          파생된 상태들
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-md border text-center">
            <div className="text-sm text-gray-600 mb-1">제곱</div>
            <div className="text-lg font-bold text-purple-600">{squared}</div>
          </div>
          <div className="bg-white p-3 rounded-md border text-center">
            <div className="text-sm text-gray-600 mb-1">타입</div>
            <div className="text-lg font-bold text-purple-600">
              {isEven ? "짝수" : "홀수"}
            </div>
          </div>
          <div className="bg-white p-3 rounded-md border text-center">
            <div className="text-sm text-gray-600 mb-1">+스텝</div>
            <div className="text-lg font-bold text-purple-600">
              {counterPlusStep}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivedAtomExampleContainer;
