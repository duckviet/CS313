import { useState, useEffect } from "react";
import { AirQualityData, HistoricalData, LocationData } from "../types";
import {
  fetchCurrentAirQuality,
  fetchHistoricalData,
  fetchHourlyData,
  fetchNearbyLocations,
} from "../services/api";

export const useCurrentAirQuality = () => {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    name: string | null;
    lat: number | null;
    lon: number | null;
  }>({
    name: "Ho Chi Minh",
    lat: 10.8230989,
    lon: 106.6296638,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchCurrentAirQuality(
          location.name || "Ho Chi Minh",
          location.lat || 10.8230989,
          location.lon || 106.6296638
        );
        setData(result);
      } catch (err) {
        setError("Failed to fetch current air quality data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [location]);

  return { data, loading, error, location, setLocation };
};

export const useHistoricalData = (days: number = 7) => {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchHistoricalData(days);
        setData(result);
      } catch (err) {
        setError("Failed to fetch historical data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  return { data, loading, error };
};

export const useHourlyData = (hours: number = 24) => {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchHourlyData(hours);
        setData(result);
      } catch (err) {
        setError("Failed to fetch hourly data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hours]);

  return { data, loading, error };
};

export const useNearbyLocations = (count: number = 10) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchNearbyLocations(count);
        setLocations(result);
      } catch (err) {
        setError("Failed to fetch nearby locations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [count]);

  return { locations, loading, error };
};
