// api.ts
import axios from "axios";
import VIETNAMPROVINCES from "../constants/vietNamProvince.constant";
import {
  AirQualityData,
  HistoricalData,
  LocationData,
  PredictionResponse,
} from "../types";
import { calculateAQICategory } from "../utils/aqiCalculator";
import { client } from "./axios";

const API_KEY = "a296a1efa72bc06b0cf1897316c7224b";
const BASE_URL = "https://pro.openweathermap.org/data/2.5";
const NEXT_PUBLIC_BACKEND_URL = "https://2348-42-116-6-43.ngrok-free.app";

const calculateAQI = (components: any): number => {
  // Simplified AQI calculation based on PM2.5
  const pm25 = components.pm2_5;
  if (pm25 <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
  if (pm25 <= 35.4)
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4)
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4)
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4)
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
};

export const fetchCurrentAirQuality = async (
  name: string = "Ho Chi Minh",
  lat: number = 10.8230989,
  lon: number = 106.6296638
): Promise<AirQualityData> => {
  const [airQualityResponse, weatherResponse] = await Promise.all([
    fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
    fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    ),
  ]);

  const airQualityData = await airQualityResponse.json();
  const weatherData = await weatherResponse.json();

  const aqi = calculateAQI(airQualityData.list[0].components);

  return {
    id: Date.now().toString(),
    city: name,
    location: weatherData.name,
    timestamp: new Date(airQualityData.list[0].dt * 1000),
    aqi,
    category: calculateAQICategory(aqi),
    pollutants: {
      pm25: airQualityData.list[0].components.pm2_5,
      pm10: airQualityData.list[0].components.pm10,
      co2: airQualityData.list[0].components.co,
      no2: airQualityData.list[0].components.no2,
      o3: airQualityData.list[0].components.o3,
    },
    temperature: weatherData.main.temp,
    humidity: weatherData.main.humidity,
  };
};

export const fetchNearbyLocations = async (
  count: number = 10
): Promise<LocationData[]> => {
  // Define nearby city coordinates
  const cities = VIETNAMPROVINCES.slice(0, count);

  const locationsData = await Promise.all(
    cities.map(async (city) => {
      const airQualityData = await fetchCurrentAirQuality(
        city.name,
        city.lat,
        city.lon
      );
      return {
        id: city.id,
        name: city.name,
        latitude: city.lat,
        longitude: city.lon,
        lastReading: airQualityData,
      };
    })
  );

  return locationsData;
};

export const fetchHistoricalData = async (
  days: number = 7,
  lat: number,
  lon: number
): Promise<HistoricalData[]> => {
  const start = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
  const end = Math.floor(Date.now() / 1000);

  const response = await fetch(
    `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
  );
  const data = await response.json();

  return data.list
    .filter((_: any, index: number) => index % 24 === 0)
    .map((item: any) => ({
      date: new Date(item.dt * 1000),
      aqi: calculateAQI(item.components),
      pm25: item.components.pm2_5,
      pm10: item.components.pm10,
      co2: item.components.co,
      no2: item.components.no2,
      o3: item.components.o3,
    }));
};

export const fetchHourlyData = async (
  hours: number = 24
): Promise<HistoricalData[]> => {
  const lat = 37.7749;
  const lon = -122.4194;
  const start = Math.floor(Date.now() / 1000) - hours * 60 * 60;
  const end = Math.floor(Date.now() / 1000);

  const response = await fetch(
    `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
  );
  const data = await response.json();

  return data.list.map((item: any) => ({
    date: new Date(item.dt * 1000),
    aqi: calculateAQI(item.components),
    pm25: item.components.pm2_5,
    pm10: item.components.pm10,
    co2: item.components.co,
    no2: item.components.no2,
    o3: item.components.o3,
  }));
};

interface AQIPredictionInput {
  AQI_Value: number;
  CO_AQI_Value: number;
  Ozone_AQI_Value: number;
  NO2_AQI_Value: number;
  PM2_5_AQI_Value: number;
}

interface AQIPredictionResponse {
  predicted_AQI_Category: string;
}

export const predictAQICategory = async (
  input: AQIPredictionInput
): Promise<AQIPredictionResponse> => {
  try {
    const response = await client.post(
      `${NEXT_PUBLIC_BACKEND_URL}/predict`,
      { ...input },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
      throw new Error(
        `API request failed: ${error.response?.statusText || error.message}`
      );
    }
    console.error("Error predicting AQI category:", error);
    throw error;
  }
};

export const fetchPredictionData = async (
  lat: number,
  lon: number
): Promise<HistoricalData[]> => {
  // Fetch forecast data from OpenWeather API
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();

  // Transform forecast data into our format with predicted PM2.5 values
  return data.list.slice(0, 8).map((item: any) => {
    // Simple prediction based on temperature, humidity, and time of day
    const hour = new Date(item.dt * 1000).getHours();
    const baseValue = 12; // Base PM2.5 value

    // Factors affecting PM2.5
    const tempFactor = Math.max(0, (item.main.temp - 20) / 10); // Higher temp = higher PM2.5
    const humidityFactor = item.main.humidity / 100; // Higher humidity = higher PM2.5
    const timeFactor = hour >= 7 && hour <= 19 ? 1.2 : 0.8; // Higher during day

    const predictedPM25 = baseValue + tempFactor * 5 + humidityFactor * 8;
    const adjustedPM25 = predictedPM25 * timeFactor;

    return {
      date: new Date(item.dt * 1000),
      aqi: calculateAQI({ pm2_5: adjustedPM25 }),
      pm25: adjustedPM25,
      pm10: adjustedPM25 * 1.5,
      co2: 400 + Math.random() * 100,
      no2: 20 + Math.random() * 30,
      o3: 30 + Math.random() * 20,
    };
  });
};

export const fetchGrouthTruthData = async (
  start_date: string = "2022-05-25",
  end_date: string = "2022-06-04"
): Promise<HistoricalData[]> => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/ground-truth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const data = await response.json();
  // Ensure we return an array of HistoricalData
  return data.ground_truth;
};

export const fetchPredictionArima = async (
  start_date: string = "2022-05-25",
  end_date: string = "2022-06-04"
): Promise<PredictionResponse> => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/predict/arima`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const data = await response.json();
  return data;
};

export const fetchPredictionProphet = async (
  start_date: string = "2022-05-25",
  end_date: string = "2022-06-04"
): Promise<PredictionResponse> => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/predict/prophet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const data = await response.json();
  return data;
};

export const fetchPredictionXGBoost = async (
  start_date: string = "2022-05-25",
  end_date: string = "2022-06-04"
): Promise<PredictionResponse> => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/predict/xgboost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const data = await response.json();
  return data;
};

export const fetchPredictionLSTM = async (
  start_date: string = "2022-05-25",
  end_date: string = "2022-06-04"
): Promise<PredictionResponse> => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/predict/lstm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_date: start_date,
      end_date: end_date,
    }),
  });
  const data = await response.json();
  return data;
};
