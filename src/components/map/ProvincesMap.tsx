import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { provinces } from '@/lib/provinces';
import { Province } from '@/lib/types';
import { getProvinceGeoJson } from '@/lib/map/province-geo-utils';
import ProvincePopup from './ProvincePopup';

interface MapViewport {
  center: [number, number];
  zoom: number;
}

interface ProvincesMapProps {
  defaultViewport?: MapViewport;
}

const defaultMapViewport: MapViewport = {
  center: [20, 0],
  zoom: 2,
};

const ProvincesMap: React.FC<ProvincesMapProps> = ({ defaultViewport = defaultMapViewport }) => {
  const [activeProvince, setActiveProvince] = useState<Province | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [mapViewport, setMapViewport] = useState<MapViewport>(defaultViewport);

  useEffect(() => {
    // Load GeoJSON data for all provinces
    const geoJsonFeatures = provinces.map(province => getProvinceGeoJson(province));
    
    // Combine all features into a single GeoJSON object
    const allGeoJson = {
      type: "FeatureCollection",
      features: geoJsonFeatures.filter(feature => feature !== null), // Filter out null features
    };

    setGeoJsonData(allGeoJson);
  }, []);

  const onProvinceClick = (province: Province) => {
    setActiveProvince(province);
  };

  const provinceStyle = (province: Province) => {
    return {
      fillColor: province.color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  const onEachProvince = (feature: any, layer: any) => {
    const province = provinces.find(p => p.id === feature.properties.provinceId);

    if (province) {
      layer.on({
        click: () => onProvinceClick(province),
        mouseover: (e: any) => {
          e.target.setStyle({
            weight: 2,
            color: '#666',
            fillOpacity: 0.9
          });
        },
        mouseout: (e: any) => {
          e.target.setStyle({
            weight: 1,
            color: 'white',
            fillOpacity: 0.7
          });
        }
      });
    }
  };

  const handleViewportChange = (viewport: MapViewport) => {
    setMapViewport(viewport);
  };

  // Custom component to update the map's viewport
  const ViewportUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(mapViewport.center, mapViewport.zoom);
    }, [map, mapViewport.center, mapViewport.zoom]);
    return null;
  };

  return (
    <div className="relative">
      <MapContainer
        className="map-container"
        style={{ height: '500px', width: '100%' }}
        center={mapViewport.center}
        zoom={mapViewport.zoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData && (
          <GeoJSON
            key="provinces-geo-json"
            data={geoJsonData}
            style={(feature: any) => {
              const province = provinces.find(p => p.id === feature.properties.provinceId);
              return province ? provinceStyle(province) : {};
            }}
            onEachFeature={onEachProvince}
          />
        )}
        <ViewportUpdater />
      </MapContainer>

      {activeProvince && (
        <ProvincePopup
          province={activeProvince}
          onClose={() => setActiveProvince(null)}
        />
      )}
    </div>
  );
};

export default ProvincesMap;
