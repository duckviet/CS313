import React, { useMemo, useCallback, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
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

// Memoized Marker component
const MemoizedMarker = memo(
  ({
    location,
    onMarkerClick,
  }: {
    location: LocationData;
    onMarkerClick: (location: LocationData) => void;
  }) => {
    const createCustomMarkerIcon = useCallback((aqi: number) => {
      const color = getAqiColor(aqi);
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
    }, []);

    if (!location.lastReading) return null;

    return (
      <Marker
        position={[location.latitude, location.longitude]}
        icon={createCustomMarkerIcon(location.lastReading.aqi)}
        eventHandlers={{
          click: () => onMarkerClick(location),
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
    );
  }
);

// Map Controller component to handle map updates
const MapController = memo(({ center }: { center: [number, number] }) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
});

// Memoized GeoJSON component
const MemoizedGeoJSON = memo(
  ({
    feature,
    style,
  }: {
    feature: Feature<MultiPolygon | Polygon, GeoJsonProperties>;
    style: any;
  }) => <GeoJSON key={String(feature.id)} data={feature} style={style} />
);

type MapViewProps = {
  currentLocation?: {
    id: number;
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

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  locations,
  className = "",
  setCurrentLocation,
}) => {
  // Memoize features map
  const featuresMap = useMemo(() => {
    const map = new Map<
      string | number,
      Feature<MultiPolygon | Polygon, GeoJsonProperties>
    >();
    if (vietnameGeoJson?.features) {
      for (const feature of vietnameGeoJson.features) {
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
  }, []);

  // Memoize selected city's GeoJSON feature and style
  const { cityGeoJsonFeature, dynamicGeoJSONStyle } = useMemo(() => {
    const primaryId = currentLocation?.id;
    const feature = featuresMap.get(primaryId as number) || featuresMap.get(29);

    const locationDataForStyle = locations.find(
      (loc) => loc.id === (primaryId || 29)
    );

    const selectedLocationAQI = locationDataForStyle?.lastReading?.aqi;
    const fillColor = getAqiColor(selectedLocationAQI);

    return {
      cityGeoJsonFeature: feature,
      dynamicGeoJSONStyle: {
        fillColor,
        fillOpacity: 0.4,
        color: "#1D4ED8",
        weight: 0.5,
        opacity: 0.8,
      },
    };
  }, [currentLocation?.id, locations, featuresMap]);

  // Memoize center coordinates
  const center = useMemo(
    () =>
      [
        currentLocation?.lat || 10.8230989,
        currentLocation?.lon || 106.6296638,
      ] as [number, number],
    [currentLocation?.lat, currentLocation?.lon]
  );

  // Memoize marker click handler
  const handleMarkerClick = useCallback(
    (location: LocationData) => {
      if (setCurrentLocation) {
        setCurrentLocation({
          id: location.id,
          name: location.name,
          lat: location.latitude,
          lon: location.longitude,
        });
      }
    },
    [setCurrentLocation]
  );

  const asiaBounds: LatLngBoundsExpression = [
    [1, 25],
    [81, 180],
  ];

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
          center={center}
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

          <MapController center={center} />

          {cityGeoJsonFeature && (
            <MemoizedGeoJSON
              feature={cityGeoJsonFeature}
              style={dynamicGeoJSONStyle}
            />
          )}

          {locations.map((location) => (
            <MemoizedMarker
              key={location.id}
              location={location}
              onMarkerClick={handleMarkerClick}
            />
          ))}
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

export default memo(MapView);
