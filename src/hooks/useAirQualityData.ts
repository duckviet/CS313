// hooks.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AirQualityData, HistoricalData, LocationData } from "../types";
import {
  fetchCurrentAirQuality,
  fetchHistoricalData,
  fetchHourlyData,
  fetchNearbyLocations,
} from "../services/api";
export const useCurrentAirQuality = () => {
  const [location, setLocation] = useState<{
    id: number;
    name: string | null;
    lat: number | null;
    lon: number | null;
  }>({
    id: 29,
    name: "Ho Chi Minh",
    lat: 10.8230989,
    lon: 106.6296638,
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<AirQualityData>({
    queryKey: ["currentAirQuality", location.name, location.lat, location.lon],
    queryFn: () =>
      fetchCurrentAirQuality(
        location.name || "Ho Chi Minh",
        location.lat || 10.8230989,
        location.lon || 106.6296638
      ),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    data,
    loading,
    error: error ? error.message : null,
    location,
    setLocation,
  };
};

export const useHistoricalData = (
  days: number = 7,
  lat: number,
  lon: number
) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<HistoricalData[]>({
    queryKey: ["historicalData", days, lat, lon],
    queryFn: () => fetchHistoricalData(days, lat, lon),
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  return { data: data || [], loading, error: error ? error.message : null };
};

export const useHourlyData = (hours: number = 24) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<HistoricalData[]>({
    queryKey: ["hourlyData", hours],
    queryFn: () => fetchHourlyData(hours),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return { data: data || [], loading, error: error ? error.message : null };
};

export const useNearbyLocations = (count: number = 63) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<LocationData[]>({
    queryKey: ["nearbyLocations", count],
    queryFn: () => fetchNearbyLocations(count),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    locations: data || [],
    loading,
    error: error ? error.message : null,
  };
};
