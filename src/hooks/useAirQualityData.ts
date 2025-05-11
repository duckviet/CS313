// hooks.ts
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AirQualityData, HistoricalData, LocationData } from "../types";
import {
  fetchCurrentAirQuality,
  fetchHistoricalData,
  fetchHourlyData,
  fetchNearbyLocations,
  fetchPredictionData,
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
    refetch,
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
    refetch,
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
export const usePredictionData = (location: {
  lat: number | null;
  lon: number | null;
}) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<HistoricalData[], Error>({
    queryKey: ["predictionData", location.lat, location.lon],
    queryFn: async () => {
      if (!location.lat || !location.lon) {
        throw new Error("Location not available");
      }
      return await fetchPredictionData(location.lat, location.lon);
    },
    enabled: !!location.lat && !!location.lon, // Only fetch if both lat and lon are available
    staleTime: 30 * 60 * 1000, // Cache data for 30 minutes
    refetchInterval: 30 * 60 * 1000, // Automatically refetch every 30 minutes
    refetchOnWindowFocus: false, // Optional: disable refetch on window focus
    retry: 1, // Retry once on failure
  });

  return {
    data: data || [],
    loading,
    error: error ? error.message : null,
    refetch,
  };
};
