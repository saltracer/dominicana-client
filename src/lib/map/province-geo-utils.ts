// File: province-geo-utils.ts
// Helper functions for handling province GeoJSON data

import type { Feature, Geometry, Point } from 'geojson';

export interface Province {
  id: string;
  name: string;
  region: string;
  establishedYear: number;
  priors: string[];
  color: string;
  coordinates: [number, number];
  boundaries?: any; // GeoJSON boundaries
  description: string;
  website?: string;
}

// Transform province coordinates to a GeoJSON Point Feature
export function provinceToPointGeoJSON(province: Province) {
  const feature: Feature = {
    type: "Feature",
    properties: {
      provinceId: province.id,
      name: province.name,
      color: province.color,
      region: province.region,
      establishedYear: province.establishedYear
    },
    geometry: {
      type: "Point",
      coordinates: province.coordinates
    }
  };
  return feature;
}

// Make sure the province boundaries are in proper GeoJSON format
export function transformBoundaries(province: Province): Feature[] {
  // If province has no boundaries, return an empty array
  if (!province.boundaries) return [];

  // If the boundaries are already in the proper format, return them directly
  if (Array.isArray(province.boundaries.features)) {
    return province.boundaries.features.map(feature => {
      // Ensure each feature has the province properties
      return {
        ...feature,
        properties: {
          ...feature.properties,
          provinceId: province.id,
          name: province.name,
        }
      };
    });
  }

  // For boundaries that are just geometry objects without the full feature structure
  // (e.g. province.boundaries might be a polygon or multipolygon directly)
  const features: Feature[] = [];

  try {
    // Create a proper GeoJSON feature from the boundaries data
    const feature: Feature = {
      type: "Feature",
      properties: {
        provinceId: province.id,
        name: province.name,
        color: province.color
      },
      geometry: province.boundaries
    };
    
    features.push(feature);
  } catch (error) {
    console.error(`Error transforming boundaries for province ${province.id}:`, error);
  }

  return features;
}

// Get the center point of a province's boundaries for centering the map
export function getProvinceBoundsCenter(province: Province): [number, number] {
  // If province has coordinates specified, use those
  if (province.coordinates && province.coordinates.length === 2) {
    return province.coordinates;
  }
  
  // Otherwise try to calculate from boundaries if available
  if (province.boundaries) {
    try {
      // Implementation depends on how boundaries are structured
      // This is a simplified example
      return [0, 0]; // Replace with actual calculation based on boundaries
    } catch (error) {
      console.error(`Error calculating center for province ${province.id}:`, error);
    }
  }
  
  // Default to a fallback position if all else fails
  return [0, 0];
}
