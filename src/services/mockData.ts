import { AirQualityData, HistoricalData, LocationData, PollutantInfo } from '../types';
import { calculateAQICategory } from '../utils/aqiCalculator';

// Generate a realistic AQI value
const generateAQI = (min = 15, max = 220): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random value within a range
const generateValue = (min: number, max: number, precision: number = 1): number => {
  return +(Math.random() * (max - min) + min).toFixed(precision);
};

// Create mock current air quality data
export const generateCurrentData = (): AirQualityData => {
  const aqi = generateAQI();
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    location: 'Current Location',
    timestamp: new Date(),
    aqi,
    category: calculateAQICategory(aqi),
    pollutants: {
      pm25: generateValue(5, 80, 1),
      pm10: generateValue(10, 120, 1),
      co2: generateValue(400, 1200, 0),
      no2: generateValue(10, 100, 1),
      o3: generateValue(20, 80, 1),
    },
    temperature: generateValue(15, 30, 1),
    humidity: generateValue(30, 80, 0),
  };
};

// Create mock historical data for the past week
export const generateHistoricalData = (days: number = 7): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date,
      aqi: generateAQI(20, 180),
      pm25: generateValue(8, 50, 1),
      pm10: generateValue(15, 90, 1),
      co2: generateValue(400, 1000, 0),
      no2: generateValue(15, 80, 1),
      o3: generateValue(20, 70, 1),
    });
  }

  return data;
};

// Generate hourly data for a single day
export const generateHourlyData = (hours: number = 24): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);

    data.push({
      date,
      aqi: generateAQI(30, 150),
      pm25: generateValue(10, 40, 1),
      pm10: generateValue(20, 80, 1),
      co2: generateValue(450, 950, 0),
      no2: generateValue(20, 70, 1),
      o3: generateValue(25, 65, 1),
    });
  }

  return data;
};

// Create mock nearby locations with air quality data
export const generateNearbyLocations = (count: number = 5): LocationData[] => {
  const locations: LocationData[] = [
    { id: '1', name: 'Downtown', latitude: 37.7749, longitude: -122.4194 },
    { id: '2', name: 'Riverside Park', latitude: 37.7694, longitude: -122.4862 },
    { id: '3', name: 'East Side', latitude: 37.8049, longitude: -122.4132 },
    { id: '4', name: 'Industrial Zone', latitude: 37.7449, longitude: -122.4294 },
    { id: '5', name: 'Hillside', latitude: 37.7549, longitude: -122.4494 },
    { id: '6', name: 'Bayside', latitude: 37.8149, longitude: -122.4094 },
    { id: '7', name: 'University Area', latitude: 37.7849, longitude: -122.4594 },
  ];

  return locations.slice(0, count).map(location => {
    const aqi = generateAQI();
    
    return {
      ...location,
      lastReading: {
        id: Math.random().toString(36).substring(2, 9),
        location: location.name,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Within the last hour
        aqi,
        category: calculateAQICategory(aqi),
        pollutants: {
          pm25: generateValue(5, 80, 1),
          pm10: generateValue(10, 120, 1),
          co2: generateValue(400, 1200, 0),
          no2: generateValue(10, 100, 1),
          o3: generateValue(20, 80, 1),
        },
        temperature: generateValue(15, 30, 1),
        humidity: generateValue(30, 80, 0),
      }
    };
  });
};

// Pollutant information
export const pollutantInfo: Record<string, PollutantInfo> = {
  pm25: {
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    unit: 'μg/m³',
    description: 'Tiny particles with diameters of 2.5 micrometers or smaller.',
    healthEffects: 'Can penetrate deep into lungs and even enter the bloodstream, causing respiratory and cardiovascular issues.',
    sources: 'Combustion (vehicles, power plants), wildfires, agricultural burning, and industrial processes.',
  },
  pm10: {
    name: 'PM10',
    fullName: 'Coarse Particulate Matter',
    unit: 'μg/m³',
    description: 'Particles with diameters between 2.5 and 10 micrometers.',
    healthEffects: 'Can cause irritation to the eyes, nose, and throat, aggravate asthma, and contribute to respiratory problems.',
    sources: 'Dust, construction, industrial activities, and road traffic.',
  },
  co2: {
    name: 'CO₂',
    fullName: 'Carbon Dioxide',
    unit: 'ppm',
    description: 'A colorless, odorless gas produced by burning carbon-based fuels.',
    healthEffects: 'High concentrations can cause headaches, dizziness, and difficulty concentrating. Primary greenhouse gas.',
    sources: 'Combustion of fossil fuels, respiration, and industrial processes.',
  },
  no2: {
    name: 'NO₂',
    fullName: 'Nitrogen Dioxide',
    unit: 'ppb',
    description: 'Reddish-brown gas with a sharp, biting odor.',
    healthEffects: 'Can irritate airways, aggravate respiratory diseases like asthma, and contribute to the formation of ground-level ozone.',
    sources: 'Vehicle emissions, power plants, and industrial processes.',
  },
  o3: {
    name: 'O₃',
    fullName: 'Ozone',
    unit: 'ppb',
    description: 'A gas composed of three oxygen atoms, a key component of smog.',
    healthEffects: 'Can trigger chest pain, coughing, throat irritation, and congestion. Worsens bronchitis, emphysema, and asthma.',
    sources: 'Created by chemical reactions between nitrogen oxides and volatile organic compounds in the presence of sunlight.',
  },
};