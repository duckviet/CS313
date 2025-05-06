import React from "react";
import { AirQualityData } from "../types";
import Card from "./UI/Card";
import AirQualityBadge from "./UI/AirQualityBadge";
import { formatTimestamp } from "../utils/formatters";
import { getAQIDescription, getRecommendation } from "../utils/aqiCalculator";

type AQIDisplayProps = {
  data: AirQualityData;
  className?: string;
};

const AQIDisplay: React.FC<AQIDisplayProps> = ({ data, className = "" }) => {
  return (
    <Card className={`${className}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3 md:flex-row flex-col">
          <h2 className="text-lg font-semibold flex gap-2 items-center md:flex-row flex-col">
            <span>{`${data.city} City`}</span>
            <span className="hidden md:block text-sm font-light font-gray-300">{`(${data.location} Station)`}</span>
          </h2>
          <span className="text-xs text-neutral-500">
            Updated: {formatTimestamp(new Date(data.timestamp))}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-neutral-50 rounded-xl p-4 w-full md:w-auto md:min-w-[160px]">
            <span className="text-sm text-neutral-600 mb-1">
              Air Quality Index
            </span>
            <span className="text-4xl font-bold">{data.aqi}</span>
            <AirQualityBadge
              category={data.category}
              size="lg"
              className="mt-2"
            />
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
