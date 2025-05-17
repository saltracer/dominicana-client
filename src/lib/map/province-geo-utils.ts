
import type { Province } from '@/lib/types';

export interface ProvinceGeoJSON {
  type: string;
  features: {
    type: string;
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
      return {
        ...province.boundaries,
        properties: {
          ...province.boundaries.properties,
          provinceId: province.id,
          name: province.name
        }
      };
    } else {
      // For direct Polygon or MultiPolygon types
      return {
        type: 'Feature',
        properties: {
          provinceId: province.id,
          name: province.name
        },
        geometry: province.boundaries
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
export function createProvinceStyler(provinces: Province[]) {
  return (feature: any) => {
    const provinceId = feature.properties.provinceId;
    const province = provinces.find(p => p.id === provinceId);
    
    return {
      fillColor: province?.color || '#6B8D8E',
      weight: 1,
      opacity: 1,
      color: '#fff',
      fillOpacity: 0.6
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
            fillOpacity: 0.8
          });
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
          });
        },
        click: () => {
          onSelectProvince(province);
        }
      });

      // Add tooltip
      const formationDate = typeof province.formation_date === 'number' 
        ? province.formation_date.toString()
        : province.formation_date;
        
      layer.bindTooltip(`
        <div class="font-medium">${province.name}</div>
        <div>Founded: ${formationDate}</div>
      `);
    }
  };
}
