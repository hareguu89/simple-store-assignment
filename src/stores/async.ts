import { createAtom } from "@/lib/atom/atom";
import { createAsyncAtom } from "@/lib/atom/createAsyncAtom";

interface User {
  id: number;
  name: string;
  email: string;
  city: string;
}

interface Weather {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
}

// Mock API 함수들
const fetchUser = async (): Promise<User> => {
  // 1-3초 랜덤 지연
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  return {
    id: 1,
    name: "김개발",
    email: "kim.dev@example.com",
    city: "서울",
  };
};

const fetchWeather = async (city: string): Promise<Weather> => {
  // 0.5-2초 랜덤 지연
  const delay = Math.random() * 1500 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // 10% 확률로 에러 발생
  if (Math.random() < 0.1) {
    throw new Error(`날씨 정보를 가져올 수 없습니다: ${city}`);
  }

  return {
    city,
    temperature: Math.floor(Math.random() * 30) + 5, // 5-35도
    condition: ["맑음", "흐림", "비", "눈"][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
  };
};

export const userAtom = createAsyncAtom(fetchUser);

export const weatherAtom = createAsyncAtom(() => fetchWeather("서울"));

export const selectedCityAtom = createAtom<string>("서울");

export const createWeatherAtom = (city: string) =>
  createAsyncAtom(() => fetchWeather(city));
