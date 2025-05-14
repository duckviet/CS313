export interface AirQualityData {
  id: string;
  city: string;
  location: string;
  timestamp: Date;
  aqi: number;
  category: AQICategory;
  pollutants: {
    pm25: number;
    pm10: number;
    co2: number;
    no2: number;
    o3: number;
  };
  temperature: number;
  humidity: number;
}

export interface HistoricalData {
  date: Date;
  pm25: number;
}

export interface PredictionResponse {
  predictions: Array<{
    date: string;
    predicted_pm25: number;
  }>;
}

export type AQICategory =
  | "good"
  | "moderate"
  | "unhealthy-for-sensitive-groups"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  lastReading?: AirQualityData;
}

export interface PollutantInfo {
  name: string;
  fullName: string;
  description: string;
  unit: string;
  healthEffects: string;
  sources: string;
}
