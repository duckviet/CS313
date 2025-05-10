import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AirQualityData, AQICategory } from "../types";
import Card from "./UI/Card";
import AirQualityBadge from "./UI/AirQualityBadge";
import { formatTimestamp } from "../utils/formatters";
import { getAQIDescription, getRecommendation } from "../utils/aqiCalculator";
import { predictAQICategory } from "../services/api";
import { Loader2, RefreshCw } from "lucide-react";

type AQIDisplayProps = {
  data: AirQualityData;
  className?: string;
  onReload?: () => void;
};

const AQIDisplay: React.FC<AQIDisplayProps> = ({
  data,
  className = "",
  onReload,
}) => {
  const fetchPredictedCategory = async () => {
    if (!data) return null;

    const result = await predictAQICategory({
      AQI_Value: data.aqi,
      CO_AQI_Value: data.pollutants.co2,
      Ozone_AQI_Value: data.pollutants.o3,
      NO2_AQI_Value: data.pollutants.no2,
      PM2_5_AQI_Value: data.pollutants.pm25,
    });
    return result.predicted_AQI_Category
      .toLowerCase()
      .split(" ")
      .join("-") as AQICategory;
  };

  const {
    data: predictedCategory,
    isLoading: isPredictionLoading,
    isError: isPredictionError,
  } = useQuery<AQICategory | null, Error>({
    queryKey: [
      "aqiPrediction",
      data.city,
      data.aqi,
      data.pollutants.co2,
      data.pollutants.o3,
      data.pollutants.no2,
      data.pollutants.pm25,
    ],
    queryFn: fetchPredictedCategory,
    enabled: !!data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <Card className={`${className}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3 md:flex-row flex-col relative">
          <h2 className="text-lg font-semibold flex gap-2 items-center md:flex-row flex-col">
            <span>{`${data.city} City`}</span>
            <span className="hidden md:block text-sm font-light font-gray-300">{`(${data.location} Station)`}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">
              Updated: {formatTimestamp(new Date(data.timestamp))}
            </span>
            {onReload && (
              <button
                onClick={onReload}
                className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
                title="Reload data"
              >
                <RefreshCw className="w-4 h-4 text-neutral-600 " />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-neutral-50 rounded-xl p-4 w-full md:w-auto md:min-w-[160px]">
            <span className="text-sm text-neutral-600 mb-1">
              Air Quality Index
            </span>
            <span className="text-4xl font-bold">{data.aqi}</span>
            {isPredictionLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {predictedCategory &&
                  !isPredictionLoading &&
                  !isPredictionError && (
                    <>
                      <AirQualityBadge
                        category={predictedCategory}
                        size="lg"
                        className="mt-1"
                      />
                    </>
                  )}
              </>
            )}
          </div>

          <div className="flex-1">
            <p className="font-medium mb-2">
              {getAQIDescription(data.category)}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              <span className="font-semibold">Recommendation: </span>
              {getRecommendation(data.category)}
            </p>

            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-500">Temperature</span>
                <span className="font-medium">{data.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-500">Humidity</span>
                <span className="font-medium">{data.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AQIDisplay;
