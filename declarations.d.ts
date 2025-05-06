// declarations.d.ts
import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";

declare module "*.geo.json" {
  // Define asia.geo.json as a FeatureCollection with Polygon or MultiPolygon geometries
  const value: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  export default value;
}
