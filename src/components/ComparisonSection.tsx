import React, { useState, useMemo } from "react";
import Card from "./UI/Card";
import Chart from "./DataVisualization/Chart";
import {
  fetchGrouthTruthData,
  fetchPredictionArima,
  fetchPredictionProphet,
  fetchPredictionXGBoost,
} from "../services/api";
import { HistoricalData, PredictionResponse } from "../types";
import { cn } from "../lib/utils";

interface ComparisonSectionProps {
  className?: string;
}

type TimeInterval = "hour" | "day";
type ChartMode = "pm25" | "aqi";

type AQICategory =
  | "good"
  | "moderate"
  | "unhealthy"
  | "unhealthyForSensitive"
  | "veryUnhealthy"
  | "hazardous";

interface Statistics {
  average: number;
  max: number;
  min: number;
  maxDate: Date;
  minDate: Date;
  standardDeviation: number;
  aqi: {
    average: number;
    max: number;
    min: number;
    maxDate: Date;
    minDate: Date;
    categories: {
      good: number;
      moderate: number;
      unhealthyForSensitive: number;
      unhealthy: number;
      veryUnhealthy: number;
      hazardous: number;
    };
  };
}

interface ModelMetrics {
  mae: number;
  rmse: number;
}

const calculateAQI = (pm25: number): number => {
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

const getAQICategory = (aqi: number): AQICategory => {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthyForSensitive";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "veryUnhealthy";
  return "hazardous";
};

const calculateStatistics = (data: HistoricalData[]): Statistics => {
  if (data.length === 0) {
    return {
      average: 0,
      max: 0,
      min: 0,
      maxDate: new Date(),
      minDate: new Date(),
      standardDeviation: 0,
      aqi: {
        average: 0,
        max: 0,
        min: 0,
        maxDate: new Date(),
        minDate: new Date(),
        categories: {
          good: 0,
          moderate: 0,
          unhealthyForSensitive: 0,
          unhealthy: 0,
          veryUnhealthy: 0,
          hazardous: 0,
        },
      },
    };
  }

  const values = data.map((item) => item.pm25);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const maxDate = data.find((item) => item.pm25 === max)?.date || new Date();
  const minDate = data.find((item) => item.pm25 === min)?.date || new Date();

  // Calculate standard deviation
  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  // Calculate AQI statistics
  const aqiValues = values.map(calculateAQI);
  const aqiSum = aqiValues.reduce((a, b) => a + b, 0);
  const aqiAvg = aqiSum / aqiValues.length;
  const aqiMax = Math.max(...aqiValues);
  const aqiMin = Math.min(...aqiValues);

  const aqiMaxDate =
    data.find((item) => calculateAQI(item.pm25) === aqiMax)?.date || new Date();
  const aqiMinDate =
    data.find((item) => calculateAQI(item.pm25) === aqiMin)?.date || new Date();

  // Count AQI categories
  const categories = aqiValues.reduce(
    (acc, aqi) => {
      const category = getAQICategory(aqi);
      acc[category]++;
      return acc;
    },
    {
      good: 0,
      moderate: 0,
      unhealthyForSensitive: 0,
      unhealthy: 0,
      veryUnhealthy: 0,
      hazardous: 0,
    }
  );

  return {
    average: avg,
    max,
    min,
    maxDate,
    minDate,
    standardDeviation: stdDev,
    aqi: {
      average: aqiAvg,
      max: aqiMax,
      min: aqiMin,
      maxDate: aqiMaxDate,
      minDate: aqiMinDate,
      categories,
    },
  };
};
const calculateMetrics = (
  groundTruth: HistoricalData[],
  predictions: HistoricalData[]
): ModelMetrics => {
  // Align predictions with ground truth by date
  const alignedData = groundTruth.map((gt) => {
    const gtDate = new Date(gt.date);
    const pred = predictions.find((p) => {
      const predDate = new Date(p.date);
      return predDate.getTime() === gtDate.getTime();
    });
    return { gt: gt.pm25, pred: pred?.pm25 || 0 };
  });
  // Calculate MAE
  const mae =
    alignedData.reduce((sum, { gt, pred }) => sum + Math.abs(gt - pred), 0) /
    alignedData.length;
  // Calculate RMSE
  const rmse = Math.sqrt(
    alignedData.reduce((sum, { gt, pred }) => sum + Math.pow(gt - pred, 2), 0) /
      alignedData.length
  );
  return {
    mae: Number(mae.toFixed(2)),
    rmse: Number(rmse.toFixed(2)),
  };
};
const StatCard: React.FC<{ title: string; stats: Statistics }> = ({
  title,
  stats,
}) => (
  <div className="bg-white rounded-xl shadow p-6  ">
    {/* PM2.5 Statistics Section */}
    <div className="mb-5">
      <div className="text-base font-semibold text-gray-700 mb-3">PM2.5</div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Average:</span>
          <span className="font-medium text-gray-800">
            {stats.average.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Maximum:</span>
          <span className="font-medium text-gray-800">
            {stats.max.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Minimum:</span>
          <span className="font-medium text-gray-800">
            {stats.min.toFixed(2)}
          </span>
        </div>
        {/* Placeholder to maintain grid alignment, adjust as needed */}
        <div></div>
      </div>
      {/* <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
        <div>Max at: {stats.maxDate.toLocaleString()}</div>
        <div>Min at: {stats.minDate.toLocaleString()}</div>
      </div> */}
    </div>

    {/* AQI Statistics Section */}
    <div className="mb-5 pt-5 border-t border-gray-200">
      <div className="w-full flex justify-between">
        <span className="text-base font-semibold text-gray-700 mb-3">
          {" "}
          AQI{" "}
        </span>{" "}
        <div className=" ">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center">
              <div
                className={cn(
                  AQI_COLORS_BG[getAQICategory(stats.aqi.average)],
                  "w-4 h-4 rounded-full mr-2"
                )}
              ></div>
              <span
                className={cn(
                  AQI_COLORS_TEXT[getAQICategory(stats.aqi.average)],
                  "font-medium"
                )}
              >
                {getAQICategory(stats.aqi.average)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Average:</span>
          <span className="font-medium text-gray-800">
            {Math.round(stats.aqi.average)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Maximum:</span>
          <span className="font-medium text-gray-800">{stats.aqi.max}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Minimum:</span>
          <span className="font-medium text-gray-800">{stats.aqi.min}</span>
        </div>
      </div>
    </div>
  </div>
);

const AQI_COLORS = {
  good: "rgb(0, 228, 0)", // Green
  moderate: "rgb(232, 232, 38)", // Yellow
  unhealthyForSensitive: "rgb(255, 126, 0)", // Orange
  unhealthy: "rgb(239, 50, 29)", // Red
  veryUnhealthy: "rgb(135, 40, 143)", // Purple
  hazardous: "rgb(86, 10, 124)", // Dark Red
};

const AQI_COLORS_TEXT = {
  good: "text-aqi-good",
  moderate: "text-aqi-moderate",
  unhealthyForSensitive: "text-aqi-unhealthyForSensitive",
  unhealthy: "text-aqi-unhealthy",
  veryUnhealthy: "text-aqi-veryUnhealthy",
  hazardous: "text-aqi-hazardous",
};
const AQI_COLORS_BG = {
  good: "bg-aqi-good",
  moderate: "bg-aqi-moderate",
  unhealthyForSensitive: "bg-aqi-unhealthyForSensitive",
  unhealthy: "bg-aqi-unhealthy",
  veryUnhealthy: "bg-aqi-veryUnhealthy",
  hazardous: "bg-aqi-hazardous",
};

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  className = "",
}) => {
  const [startDate, setStartDate] = useState("2022-05-25");
  const [endDate, setEndDate] = useState("2022-06-04");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [timeInterval, setTimeInterval] = useState<TimeInterval>("hour");
  const [chartMode, setChartMode] = useState<ChartMode>("pm25");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    groundTruth: HistoricalData[];
    arima: HistoricalData[];
    prophet: HistoricalData[];
    xgboost: HistoricalData[];
  } | null>(null);

  const calculateDailyAverage = (data: HistoricalData[]): HistoricalData[] => {
    const dailyData = new Map<string, { sum: number; count: number }>();

    data.forEach((item) => {
      const date = new Date(item.date);
      const dayKey = date.toISOString().split("T")[0];

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, { sum: 0, count: 0 });
      }

      const dayData = dailyData.get(dayKey)!;
      dayData.sum += item.pm25;
      dayData.count += 1;
    });

    return Array.from(dailyData.entries())
      .map(([dayKey, { sum, count }]) => ({
        date: new Date(dayKey),
        pm25: sum / count,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [groundTruth, arima, prophet, xgboost] = await Promise.all([
        fetchGrouthTruthData(startDate, endDate),
        fetchPredictionArima(startDate, endDate),
        fetchPredictionProphet(startDate, endDate),
        fetchPredictionXGBoost(startDate, endDate),
      ]);

      // Ensure all data is in the correct format
      const formattedData = {
        groundTruth: Array.isArray(groundTruth) ? groundTruth : [],
        arima: Array.isArray(arima?.predictions)
          ? arima.predictions.map((p) => ({
              date: new Date(p.date),
              pm25: p.predicted_pm25,
            }))
          : [],
        prophet: Array.isArray(prophet?.predictions)
          ? prophet.predictions.map((p) => ({
              date: new Date(p.date),
              pm25: p.predicted_pm25,
            }))
          : [],
        xgboost: Array.isArray(xgboost?.predictions)
          ? xgboost.predictions.map((p) => ({
              date: new Date(p.date),
              pm25: p.predicted_pm25,
            }))
          : [],
      };

      // Apply time interval filtering
      const processedData = {
        groundTruth:
          timeInterval === "day"
            ? calculateDailyAverage(formattedData.groundTruth)
            : formattedData.groundTruth,
        arima:
          timeInterval === "day"
            ? calculateDailyAverage(formattedData.arima)
            : formattedData.arima,
        prophet:
          timeInterval === "day"
            ? calculateDailyAverage(formattedData.prophet)
            : formattedData.prophet,
        xgboost:
          timeInterval === "day"
            ? calculateDailyAverage(formattedData.xgboost)
            : formattedData.xgboost,
      };

      setData(processedData);
    } catch (err) {
      setError("Failed to fetch comparison data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statistics = useMemo(() => {
    if (!data) return null;
    return {
      groundTruth: calculateStatistics(data.groundTruth),
      arima: calculateStatistics(data.arima),
      prophet: calculateStatistics(data.prophet),
      xgboost: calculateStatistics(data.xgboost),
    };
  }, [data]);

  const processedData = useMemo(() => {
    if (!data) return null;

    const processData = (items: HistoricalData[]) => {
      return items.map((item) => {
        const value =
          chartMode === "pm25" ? item.pm25 : calculateAQI(item.pm25);
        return {
          date: item.date,
          pm25: value,
          color: AQI_COLORS[getAQICategory(calculateAQI(item.pm25))],
        };
      });
    };

    return {
      groundTruth: processData(data.groundTruth),
      arima: processData(data.arima),
      prophet: processData(data.prophet),
      xgboost: processData(data.xgboost),
    };
  }, [data, chartMode]);

  const modelMetrics = useMemo(() => {
    if (!data) return null;

    return {
      arima: calculateMetrics(data.groundTruth, data.arima),
      prophet: calculateMetrics(data.groundTruth, data.prophet),
      xgboost: calculateMetrics(data.groundTruth, data.xgboost),
    };
  }, [data]);

  return (
    <Card className={`${className} mt-5`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{/* Model Comparison */}</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Start Date:</label>
              <input
                type="date"
                value={startDate}
                min={"2020-08-27"}
                max={"2022-06-04"}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">End Date:</label>
              <input
                type="date"
                value={endDate}
                min={"2020-08-27"}
                max={"2022-06-04"}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Time Interval:</label>
              <select
                value={timeInterval}
                onChange={(e) =>
                  setTimeInterval(e.target.value as TimeInterval)
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as "line" | "bar")}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="line">Line</option>
                <option value="bar">Bar</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Display:</label>
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value as ChartMode)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="pm25">PM2.5</option>
                <option value="aqi">AQI</option>
              </select>
            </div>
            <button
              onClick={handleFetchData}
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Compare"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : processedData ? (
          <div className="space-y-8">
            {/* Ground Truth Section */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Ground Truth
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-6 p-4">
                <div className="col-span-3">
                  <Chart
                    data={processedData.groundTruth}
                    type={chartType}
                    dataKey="pm25"
                    title="Ground Truth"
                    loading={loading}
                    height={300}
                    color={
                      AQI_COLORS[
                        getAQICategory(statistics?.groundTruth.aqi.average || 0)
                      ] || AQI_COLORS.good
                    }
                  />
                </div>
                <div className="col-span-1">
                  {statistics && (
                    <StatCard
                      title="Ground Truth"
                      stats={statistics.groundTruth}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* XGBoost Section */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  XGBoost Prediction
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-6 p-4">
                <div className="col-span-3">
                  <Chart
                    data={processedData.xgboost}
                    type={chartType}
                    dataKey="pm25"
                    title="XGBoost Prediction"
                    loading={loading}
                    height={300}
                    color={
                      AQI_COLORS[
                        getAQICategory(statistics?.xgboost.aqi.average || 0)
                      ] || AQI_COLORS.good
                    }
                  />
                </div>
                <div className="col-span-1">
                  {statistics && (
                    <StatCard
                      title="XGBoost Prediction"
                      stats={statistics.xgboost}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* Prophet Section */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Prophet Prediction
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-6 p-4">
                <div className="col-span-3">
                  <Chart
                    data={processedData.prophet}
                    type={chartType}
                    dataKey="pm25"
                    title="Prophet Prediction"
                    loading={loading}
                    height={300}
                    color={
                      AQI_COLORS[
                        getAQICategory(statistics?.prophet.aqi.average || 0)
                      ] || AQI_COLORS.good
                    }
                  />
                </div>
                <div className="col-span-1">
                  {statistics && (
                    <StatCard
                      title="Prophet Prediction"
                      stats={statistics.prophet}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ARIMA Section */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  ARIMA Prediction
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-6 p-4">
                <div className="col-span-3">
                  <Chart
                    data={processedData.arima}
                    type={chartType}
                    dataKey="pm25"
                    title="ARIMA Prediction"
                    loading={loading}
                    height={300}
                    color={
                      AQI_COLORS[
                        getAQICategory(statistics?.arima.aqi.average || 0)
                      ] || AQI_COLORS.good
                    }
                  />
                </div>
                <div className="col-span-1">
                  {statistics && (
                    <StatCard
                      title="ARIMA Prediction"
                      stats={statistics.arima}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Model Comparison Metrics */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Model Comparison Metrics
                </h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MAE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RMSE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modelMetrics && (
                        <>
                          {" "}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              XGBoost
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.xgboost.mae}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.xgboost.rmse}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Prophet
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.prophet.mae}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.prophet.rmse}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ARIMA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.arima.mae}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {modelMetrics.arima.rmse}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {/* <p className="mb-2">
                    <strong>MAE (Mean Absolute Error):</strong> Average absolute
                    difference between predicted and actual values. Lower is
                    better.
                  </p>
                  <p className="mb-2">
                    <strong>RMSE (Root Mean Square Error):</strong> Square root
                    of the average squared differences. Lower is better.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            Select dates and click Compare to view predictions
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComparisonSection;
