import {
  AirQualityData,
  HistoricalData,
  LocationData,
  AQICategory,
} from "../types";
import { calculateAQICategory } from "../utils/aqiCalculator";

const API_KEY = "a296a1efa72bc06b0cf1897316c7224b";
const BASE_URL = "https://pro.openweathermap.org/data/2.5";

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
  const cities = [
    { name: "Ho Chi Minh City", lat: 10.8230989, lon: 106.6296638 },
    { name: "An Giang", lat: 10.5215836, lon: 105.1258955 },
    { name: "Bà Rịa-Vũng Tàu", lat: 10.5417397, lon: 107.2429976 },
    { name: "Bắc Giang", lat: 21.2819921, lon: 106.1974769 },
    { name: "Bắc Kạn", lat: 22.3032923, lon: 105.876004 },
    { name: "Bạc Liêu", lat: 9.2940027, lon: 105.7215663 },
    { name: "Bắc Ninh", lat: 21.121444, lon: 106.1110501 },
    { name: "Bến Tre", lat: 10.2433556, lon: 106.375551 },
    { name: "Bình Dương", lat: 11.3254024, lon: 106.477017 },
    { name: "Bình Định", lat: 14.1665324, lon: 108.902683 },
    { name: "Bình Phước", lat: 11.7511894, lon: 106.7234639 },
    { name: "Bình Thuận", lat: 11.0903703, lon: 108.0720781 },
    { name: "Cà Mau", lat: 9.1526728, lon: 105.1960795 },
    { name: "Cần Thơ", lat: 10.0341851, lon: 105.7225507 },
    { name: "Cao Bằng", lat: 22.635689, lon: 106.2522143 },
    { name: "Đà Nẵng", lat: 16.0544068, lon: 108.2021667 },
    { name: "Đắk Lắk", lat: 12.7100116, lon: 108.2377519 },
    { name: "Đắk Nông", lat: 12.2646476, lon: 107.609806 },
    { name: "Điện Biên", lat: 21.8042309, lon: 103.1076525 },
    { name: "Đồng Nai", lat: 11.0686305, lon: 107.1675976 },
    { name: "Đồng Tháp", lat: 10.4937989, lon: 105.6881788 },
    { name: "Gia Lai", lat: 13.8078943, lon: 108.109375 },
    { name: "Hà Giang", lat: 22.8025588, lon: 104.9784494 },
    { name: "Hà Nam", lat: 20.5835196, lon: 105.92299 },
    { name: "Hà Nội", lat: 21.0277644, lon: 105.8341598 },
    { name: "Hà Tĩnh", lat: 18.3559537, lon: 105.8877494 },
    { name: "Hải Dương", lat: 20.9373413, lon: 106.3145542 },
    { name: "Hải Phòng", lat: 20.8449115, lon: 106.6880841 },
    { name: "Hậu Giang", lat: 9.757898, lon: 105.6412527 },
    { name: "Hồ Chí Minh", lat: 10.8230989, lon: 106.6296638 },
    { name: "Hòa Bình", lat: 20.6861265, lon: 105.3131185 },
    { name: "Hưng Yên", lat: 20.8525711, lon: 106.0169971 },
    { name: "Khánh Hòa", lat: 12.2585098, lon: 109.0526076 },
    { name: "Kiên Giang", lat: 9.8249587, lon: 105.1258955 },
    { name: "Kon Tum", lat: 14.3497403, lon: 108.0004606 },
    { name: "Lai Châu", lat: 22.3862227, lon: 103.4702631 },
    { name: "Lâm Đồng", lat: 11.5752791, lon: 108.1428669 },
    { name: "Lạng Sơn", lat: 21.853708, lon: 106.761519 },
    { name: "Lào Cai", lat: 22.4809431, lon: 103.9754959 },
    { name: "Long An", lat: 10.5607168, lon: 106.6497623 },
    { name: "Nam Định", lat: 20.4388225, lon: 106.1621053 },
    { name: "Nghệ An", lat: 19.2342489, lon: 104.9200365 },
    { name: "Ninh Bình", lat: 20.2506149, lon: 105.9744536 },
    { name: "Ninh Thuận", lat: 11.6738767, lon: 108.8629572 },
    { name: "Phú Thọ", lat: 21.268443, lon: 105.2045573 },
    { name: "Phú Yên", lat: 13.0881861, lon: 109.0928764 },
    { name: "Quảng Bình", lat: 17.6102715, lon: 106.3487474 },
    { name: "Quảng Nam", lat: 15.5393538, lon: 108.019102 },
    { name: "Quảng Ngãi", lat: 15.1213873, lon: 108.8044145 },
    { name: "Quảng Ninh", lat: 21.006382, lon: 107.2925144 },
    { name: "Quảng Trị", lat: 16.7403074, lon: 107.1854679 },
    { name: "Sóc Trăng", lat: 9.602521, lon: 105.9739049 },
    { name: "Sơn La", lat: 21.1022284, lon: 103.7289167 },
    { name: "Tây Ninh", lat: 11.3351554, lon: 106.1098854 },
    { name: "Thái Bình", lat: 20.4463471, lon: 106.3365828 },
    { name: "Thái Nguyên", lat: 21.5671559, lon: 105.8252038 },
    { name: "Thanh Hóa", lat: 19.806692, lon: 105.7851816 },
    { name: "Thừa Thiên-Huế", lat: 16.467397, lon: 107.5905326 },
    { name: "Tiền Giang", lat: 10.4493324, lon: 106.3420504 },
    { name: "Trà Vinh", lat: 9.812741, lon: 106.2992912 },
    { name: "Tuyên Quang", lat: 21.7767246, lon: 105.2280196 },
    { name: "Vĩnh Long", lat: 10.239574, lon: 105.9571928 },
    { name: "Vĩnh Phúc", lat: 21.3608805, lon: 105.5474373 },
    { name: "Yên Bái", lat: 21.7167689, lon: 104.8985878 },
  ].slice(0, count);

  const locationsData = await Promise.all(
    cities.map(async (city) => {
      const airQualityData = await fetchCurrentAirQuality(
        city.name,
        city.lat,
        city.lon
      );
      return {
        id: city.name.toLowerCase().replace(/\s+/g, "-"),
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
  days: number = 7
): Promise<HistoricalData[]> => {
  const lat = 37.7749;
  const lon = -122.4194;
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
