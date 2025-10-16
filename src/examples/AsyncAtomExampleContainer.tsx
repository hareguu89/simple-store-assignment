import { useAtom } from "@/lib/atom/useAtom";
import { userAtom, weatherAtom } from "@/stores/async";
import { Suspense } from "react";
import { ErrorBoundary, ErrorFallback } from "./ErrorBoundary";

// 로딩 스피너 컴포넌트
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  </div>
);

// 사용자 정보 컴포넌트
const UserInfo = () => {
  const [user] = useAtom(userAtom);

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">👤 사용자 정보</h3>
      <div className="bg-white p-3 rounded-md border space-y-2">
        <div>
          <span className="font-medium">이름:</span> {user.name}
        </div>
        <div>
          <span className="font-medium">이메일:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">도시:</span> {user.city}
        </div>
      </div>
    </div>
  );
};

// 날씨 정보 컴포넌트
const WeatherInfo = () => {
  const [weather] = useAtom(weatherAtom);

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">🌤️ 날씨 정보</h3>
      <div className="bg-white p-3 rounded-md border space-y-2">
        <div>
          <span className="font-medium">도시:</span> {weather.city}
        </div>
        <div>
          <span className="font-medium">온도:</span> {weather.temperature}°C
        </div>
        <div>
          <span className="font-medium">상태:</span> {weather.condition}
        </div>
        <div>
          <span className="font-medium">습도:</span> {weather.humidity}%
        </div>
      </div>
    </div>
  );
};

// 새로고침 함수
const handleRefresh = () => {
  window.location.reload();
};

const AsyncAtomExampleContainer = () => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">비동기 Atom 예제</h2>
        <p className="text-gray-600">
          비동기 데이터를 로딩하고 Suspense와 Error Boundary를 활용합니다
        </p>
      </div>

      {/* 새로고침 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 사용자 정보 */}
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} resetErrorBoundary={reset} />
          )}
          onReset={handleRefresh}
        >
          <Suspense
            fallback={<LoadingSpinner message="사용자 정보 로딩 중..." />}
          >
            <UserInfo />
          </Suspense>
        </ErrorBoundary>

        {/* 날씨 정보 */}
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} resetErrorBoundary={reset} />
          )}
          onReset={handleRefresh}
        >
          <Suspense
            fallback={<LoadingSpinner message="날씨 정보 로딩 중..." />}
          >
            <WeatherInfo />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AsyncAtomExampleContainer;
