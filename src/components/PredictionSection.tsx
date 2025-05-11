import React from "react";
import Card from "./UI/Card";
import Chart from "./DataVisualization/Chart";
import { usePredictionData } from "../hooks/useAirQualityData";
import { formatPollutantValue } from "../utils/formatters";

interface PredictionSectionProps {
  location: {
    lat: number | null;
    lon: number | null;
  };
}

const PredictionSection: React.FC<PredictionSectionProps> = ({ location }) => {
  const { data, loading, error } = usePredictionData(location);

  return (
    <Card className="mt-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">PM2.5 Prediction</h3>
            <p className="text-sm text-neutral-500 mt-1">
              24-hour forecast based on historical patterns
            </p>
          </div>
          {data && data.length > 0 && (
            <div className="text-right">
              <p className="text-sm font-medium">
                Next 24h Average:
                <span className="ml-2 text-primary-600">
                  {formatPollutantValue(
                    data.reduce((acc, item) => acc + item.pm25, 0) /
                      data.length,
                    "pm25"
                  )}
                </span>
              </p>
            </div>
          )}
        </div>

        {error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : (
          <Chart
            data={data || []}
            type="line"
            dataKey="pm25"
            title="PM2.5 Prediction"
            loading={loading}
            height={250}
            color="rgb(234, 88, 12)"
          />
        )}
      </div>
    </Card>
  );
};

export default PredictionSection;
