import type { Province } from '@/lib/types';
import { GeoJSON } from 'leaflet';

export interface ProvinceGeoJSON {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    properties: {
      provinceId: string;
      name: string;
      [key: string]: any;
    };
    geometry: any;
  }[];
}

/**
 * Converts province data into GeoJSON format for React-Leaflet
 */
export function provincesToGeoJSON(provinces: Province[]): ProvinceGeoJSON {
  const features = provinces.map(province => {
    // Handle different boundary formats
    if (province.boundaries.type === 'Feature') {
      // For boundaries that are already in Feature format
      return {
        ...province.boundaries,
        type: 'Feature' as const,
        properties: {
          ...province.boundaries.properties,
          provinceId: province.id,
          name: province.name
        },
        geometry: province.boundaries.geometry // Ensure the geometry is explicitly assigned
      };
    } else {
      // For direct Polygon or MultiPolygon types
      return {
        type: 'Feature' as const,
        properties: {
          provinceId: province.id,
          name: province.name
        },
        geometry: province.boundaries // Ensure the geometry is explicitly assigned
      };
    }
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

/**
 * Creates a style function for GeoJSON features
 */
export function createProvinceStyler(provinces: Province[], selectedProvince: Province | null = null) {
  return (feature: any) => {
    const provinceId = feature.properties.provinceId;
    const province = provinces.find(p => p.id === provinceId);
    const isSelected = selectedProvince?.id === provinceId;
    
    return {
      fillColor: province?.color || '#6B8D8E',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#fff' : province?.color,
      fillOpacity: isSelected ? 0.9 : 0.6
    };
  };
}

/**
 * Creates hover and click handlers for GeoJSON features
 */
export function createProvinceInteractions(provinces: Province[], onSelectProvince: (province: Province) => void) {
  return (feature: any, layer: any) => {
    const provinceId = feature.properties.provinceId;
    const province = provinces.find(p => p.id === provinceId);
    
    if (province) {
      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            opacity: 1,
            color: '#fff',
            fillOpacity: 0.9
          });
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          const layer = e.target;
          // Check if this is the selected province before reverting style
          const isSelected = layer.feature.properties.provinceId === e.target._map._selectedProvinceId;
          if (!isSelected) {
            layer.setStyle({
              weight: 1,
              opacity: 1,
              color: province?.color,
              fillOpacity: 0.6
            });
          }
        },
        click: () => {
          // Store selected province ID on the map instance for reference
          if (layer._map) {
            layer._map._selectedProvinceId = province.id;
          }
          onSelectProvince(province);
        }
      });

      // Create consistent tooltip content between marker and province
      const formationDate = typeof province.formation_date === 'number' 
        ? province.formation_date.toString()
        : province.formation_date;
        
      layer.bindTooltip(`
        <div class="font-medium">${province.name}</div>
        <div>Region: ${province.region}</div>
        <div>Founded: ${formationDate}</div>
      `);
    }
  };
}
