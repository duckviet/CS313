import React, { useEffect } from "react";
import AQIDisplay from "../components/AQIDisplay";
import PollutantsOverview from "../components/PollutantsOverview";
import HistoricalDataSection from "../components/HistoricalDataSection";
import MapView from "../components/DataVisualization/MapView";
import Card from "../components/UI/Card";
import Loader from "../components/UI/Loader";
import {
  useCurrentAirQuality,
  useNearbyLocations,
} from "../hooks/useAirQualityData";
import PredictionSection from "../components/PredictionSection";
import HealthAdviceSection from "../components/HealthAdvanceSection";
import {
  fetchGrouthTruthData,
  fetchPredictionArima,
  fetchPredictionProphet,
} from "../services/api";
import ComparisonSection from "../components/ComparisonSection";

const Dashboard: React.FC = () => {
  const {
    data: currentData,
    loading: currentLoading,
    location: currentLocation,
    setLocation: setCurrentLocation,
    refetch: refetchCurrentData,
  } = useCurrentAirQuality();
  const { locations, loading: locationsLoading } = useNearbyLocations();

  const handleLocationChange = (location: {
    id: number;
    name: string | null;
    lat: number | null;
    lon: number | null;
  }) => {
    console.log("Selected location:", location);
    setCurrentLocation(location);
  };

  const handleReload = () => {
    refetchCurrentData();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-5">
        Air Quality Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <ComparisonSection className="lg:col-span-3" /> */}
        <div className="lg:col-span-2">
          {currentLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader size="lg" text="Loading current air quality data..." />
            </div>
          ) : currentData ? (
            <>
              <AQIDisplay data={currentData} onReload={handleReload} />
              <PollutantsOverview data={currentData} className="mt-6" />
              <HistoricalDataSection data={currentLocation} />
              <PredictionSection location={currentLocation} />

              <HealthAdviceSection
                category={currentData.category}
                className="mt-6"
                currentData={currentData}
              />
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-neutral-600">
                No air quality data available. Please check your connection or
                try again later.
              </p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 lg:row-span-2">
          {locationsLoading ? (
            <Card className="h-full flex items-center justify-center min-h-[600px]">
              <Loader text="Loading nearby locations..." />
            </Card>
          ) : (
            <MapView
              currentLocation={currentLocation}
              locations={locations}
              setCurrentLocation={handleLocationChange}
              className="h-full min-h-[600px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
