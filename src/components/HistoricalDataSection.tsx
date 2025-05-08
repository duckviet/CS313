import React, { useState } from "react";
import Card from "./UI/Card";
import Chart from "./DataVisualization/Chart";
import { useHistoricalData, useHourlyData } from "../hooks/useAirQualityData";
import { BarChart3, LineChart } from "lucide-react";

type TimeRange = "24h" | "7d" | "30d";
type ChartType = "line" | "bar";
type PollutantType = "aqi" | "pm25" | "pm10" | "co2" | "no2" | "o3";

const pollutantOptions: { value: PollutantType; label: string }[] = [
  { value: "aqi", label: "AQI" },
  { value: "pm25", label: "PM2.5" },
  { value: "pm10", label: "PM10" },
  { value: "co2", label: "CO₂" },
  { value: "no2", label: "NO₂" },
  { value: "o3", label: "O₃" },
];
type Props = {
  data: {
    id: number;
    name: string | null;
    lat: number | null;
    lon: number | null;
  };
};
const HistoricalDataSection: React.FC<Props> = ({ data: airdata }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedPollutant, setSelectedPollutant] =
    useState<PollutantType>("aqi");

  const { data: dailyData, loading: dailyLoading } = useHistoricalData(
    timeRange === "7d" ? 7 : 30,
    airdata.lat || 10.8230989,
    airdata.lon || 106.6296638
  );
  const { data: hourlyData, loading: hourlyLoading } = useHourlyData(24);

  const data = timeRange === "24h" ? hourlyData : dailyData;
  const loading = timeRange === "24h" ? hourlyLoading : dailyLoading;

  return (
    <Card className="mt-6">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Historical Trend</h3>

          <div className="flex flex-wrap gap-2">
            <div className="flex overflow-hidden rounded-md border border-neutral-200">
              <button
                onClick={() => setTimeRange("24h")}
                className={`px-3 py-1.5 text-xs font-medium ${
                  timeRange === "24h"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1.5 text-xs font-medium ${
                  timeRange === "7d"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1.5 text-xs font-medium ${
                  timeRange === "30d"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                30d
              </button>
            </div>

            <div className="flex overflow-hidden rounded-md border border-neutral-200">
              <button
                onClick={() => setChartType("line")}
                className={`px-2 py-1.5 text-sm ${
                  chartType === "line"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
                title="Line Chart"
              >
                <LineChart size={16} />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-2 py-1.5 text-sm ${
                  chartType === "bar"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
                title="Bar Chart"
              >
                <BarChart3 size={16} />
              </button>
            </div>

            <select
              value={selectedPollutant}
              onChange={(e) =>
                setSelectedPollutant(e.target.value as PollutantType)
              }
              className="border border-neutral-200 rounded-md px-3 py-1.5 text-sm bg-white"
            >
              {pollutantOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Chart
          data={data}
          type={chartType}
          dataKey={selectedPollutant}
          title={
            pollutantOptions.find((p) => p.value === selectedPollutant)
              ?.label || "Data"
          }
          loading={loading}
          height={300}
        />
      </div>
    </Card>
  );
};

export default HistoricalDataSection;
