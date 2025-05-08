import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { LocationData } from "../../types";
import AirQualityBadge from "../UI/AirQualityBadge";
import { divIcon, LatLngBoundsExpression } from "leaflet";
import {
  Feature,
  MultiPolygon,
  GeoJsonProperties,
  Polygon,
  FeatureCollection,
} from "geojson";
import vietnameGeoJsonData from "../../assets/vietnam.geo.json";

// Assuming vietnam.geo.json is a FeatureCollection.
// Cast it to the correct type for better type safety.
const vietnameGeoJson = vietnameGeoJsonData as FeatureCollection<
  MultiPolygon | Polygon,
  GeoJsonProperties
>;

type MapViewProps = {
  currentLocation?: {
    id: number; // Assuming id is always a number for locations
    name: string | null;
    lat: number | null;
    lon: number | null;
  };
  locations: LocationData[];
  className?: string;
  setCurrentLocation?: (location: {
    id: number;
    name: string | null;
    lat: number | null;
    lon: number | null;
  }) => void;
};

// Helper function to get color based on AQI (reused from marker logic)
const getAqiColor = (aqi: number | undefined | null): string => {
  if (aqi === undefined || aqi === null) {
    return "#cccccc"; // Default grey for no data
  }
  if (aqi <= 50) return "#22c55e"; // Green
  if (aqi <= 100) return "#ffa318"; // Orange
  if (aqi <= 150) return "#e45c00"; // Red-orange
  if (aqi <= 200) return "#ef4444"; // Red
  if (aqi <= 300) return "#b91c1c"; // Dark Red
  return "#450a0a"; // Maroon
};

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  locations,
  className = "",
  setCurrentLocation,
}) => {
  // Memoize a map of GeoJSON features for efficient lookup by ID
  const featuresMap = useMemo(() => {
    const map = new Map<
      string | number,
      Feature<MultiPolygon | Polygon, GeoJsonProperties>
    >();
    if (vietnameGeoJson && vietnameGeoJson.features) {
      for (const feature of vietnameGeoJson.features) {
        // Ensure feature and feature.id are valid before setting
        if (
          feature &&
          (typeof feature.id === "number" || typeof feature.id === "string")
        ) {
          map.set(
            feature.id,
            feature as Feature<MultiPolygon | Polygon, GeoJsonProperties>
          );
        }
      }
    }
    return map;
  }, [vietnameGeoJson.features]); // Recompute only if the features array itself changes

  // Memoize the selected city's GeoJSON feature and its dynamic style
  const { cityGeoJsonFeature, dynamicGeoJSONStyle } = useMemo(() => {
    let feature;
    let selectedLocationAQI: number | undefined | null;

    // 1. Find the relevant GeoJSON feature based on currentLocation ID or default to 29
    const primaryId = currentLocation?.id;
    if (typeof primaryId === "number") {
      feature = featuresMap.get(primaryId);
    }
    // Fallback GeoJSON feature if primary is not found
    if (!feature) {
      feature = featuresMap.get(29); // Default to Ho Chi Minh GeoJSON
    }

    // 2. Find the corresponding LocationData from the locations array to get the AQI
    let locationDataForStyle: LocationData | undefined;
    const locationIdForStyle = currentLocation?.id;

    if (typeof locationIdForStyle === "number") {
      locationDataForStyle = locations.find(
        (loc) => loc.id === locationIdForStyle
      );
    }

    // If no location data found for the primary ID, try the default ID 29
    if (!locationDataForStyle) {
      locationDataForStyle = locations.find((loc) => loc.id === 29);
    }

    // Get AQI, fallback to undefined/null if no reading
    selectedLocationAQI = locationDataForStyle?.lastReading?.aqi;

    // 3. Determine fill color based on AQI
    const fillColor = getAqiColor(selectedLocationAQI);

    // 4. Create the dynamic style object
    const dynamicStyle = {
      fillColor: fillColor,
      fillOpacity: 0.4, // You can adjust opacity as needed
      color: "#1D4ED8", // Border color (can be static or dynamic)
      weight: 0.5,
      opacity: 0.8, // Border opacity
    };

    return { cityGeoJsonFeature: feature, dynamicGeoJSONStyle: dynamicStyle };
  }, [currentLocation?.id, locations, featuresMap]); // Dependencies: currentLocation ID, locations array, and the featuresMap

  const asiaBounds: LatLngBoundsExpression = [
    [1, 25],
    [81, 180],
  ];

  const createCustomMarkerIcon = (aqi: number) => {
    const color = getAqiColor(aqi); // Use the helper function

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

          {/* Add GeoJSON layer for the selected city if found */}
          {cityGeoJsonFeature && dynamicGeoJSONStyle && (
            <GeoJSON
              key={String(cityGeoJsonFeature.id)} // Key helps React update the component
              data={cityGeoJsonFeature}
              style={dynamicGeoJSONStyle} // Use the dynamic style
            />
          )}

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
                        id: location.id,
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
