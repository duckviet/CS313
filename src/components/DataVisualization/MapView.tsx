import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LocationData } from "../../types";
import AirQualityBadge from "../UI/AirQualityBadge";
import { divIcon, LatLngBoundsExpression } from "leaflet";

import vietnameGeoJson from "../../assets/vietnam.geo.json";
import * as turf from "@turf/turf";

type MapViewProps = {
  currentLocation?: {
    name: string | null;
    lat: number | null;
    lon: number | null;
  };
  locations: LocationData[];
  className?: string;
  setCurrentLocation?: (location: {
    name: string | null;
    lat: number | null;
    lon: number | null;
  }) => void;
};

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  locations,
  className = "",
  setCurrentLocation,
}) => {
  useEffect(() => {
    console.log(vietnameGeoJson.features.map((f) => f.properties.name));
  }, [vietnameGeoJson]);
  const asiaBounds: LatLngBoundsExpression = [
    [1, 25],
    [81, 180],
  ];

  const createCustomMarkerIcon = (aqi: number) => {
    const color =
      aqi <= 50
        ? "#22c55e"
        : aqi <= 100
        ? "#ffa318"
        : aqi <= 150
        ? "#e45c00"
        : aqi <= 200
        ? "#ef4444"
        : aqi <= 300
        ? "#b91c1c"
        : "#450a0a";

    return divIcon({
      className: "custom-marker-icon",
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200 ${className}`}
    >
      <div className="p-4 border-b border-neutral-200">
        <h3 className="font-semibold">Air Quality by Location</h3>
        <p className="text-xs text-neutral-500 mt-1">
          Showing {locations.length} monitoring stations
        </p>
      </div>
      <div className="h-[calc(100%-8rem)]">
        <MapContainer
          center={
            currentLocation
              ? [
                  currentLocation?.lat || 10.8230989,
                  currentLocation?.lon || 106.6296638,
                ]
              : [10.8230989, 106.6296638]
          }
          zoom={12}
          maxBounds={asiaBounds}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {locations.map((location) =>
            location.lastReading ? (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={createCustomMarkerIcon(location.lastReading.aqi)}
                eventHandlers={{
                  click: () => {
                    if (setCurrentLocation) {
                      setCurrentLocation({
                        name: location.name,
                        lat: location.latitude,
                        lon: location.longitude,
                      });
                    }
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h4 className="font-medium text-sm">{location.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-500">AQI</span>
                      <span className="font-semibold text-sm">
                        {location.lastReading.aqi}
                      </span>
                    </div>
                    <AirQualityBadge
                      category={location.lastReading.category}
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
      <div className="p-3 bg-neutral-50 border-t border-neutral-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {locations.slice(0, 3).map((location) => (
            <div key={location.id} className="text-xs">
              <p className="font-medium truncate">{location.name}</p>
              {location.lastReading && (
                <AirQualityBadge
                  category={location.lastReading.category}
                  size="sm"
                  className="mt-0.5"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
