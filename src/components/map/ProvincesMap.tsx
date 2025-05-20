import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { provinces, Province } from '@/lib/provinces';
import { provincesToGeoJSON, createProvinceStyler, createProvinceInteractions } from '@/lib/map/province-geo-utils';
import ProvinceDetailCard from './ProvinceDetailCard';

// Leaflet marker configuration (required to avoid errors)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Checking if the code is running in a browser environment before accessing window
const isBrowser = typeof window !== 'undefined';

// Setting default marker
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: isBrowser ? iconRetinaUrl : '',
  iconUrl: isBrowser ? iconUrl : '',
  shadowUrl: isBrowser ? shadowUrl : ''
});

interface ViewBounds {
  _northEast: {
    lat: number;
    lng: number;
  };
  _southWest: {
    lat: number;
    lng: number;
  };
}

const ProvincesMap: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [viewBounds, setViewBounds] = useState<ViewBounds | null>(null);
  const mapRef = useRef<L.Map>(null);
  
  const geoJsonData = provincesToGeoJSON(provinces);
  const provinceStyler = createProvinceStyler(provinces, selectedProvince);
  const provinceInteractions = createProvinceInteractions(provinces, setSelectedProvince);

  // Fly to selected province
  function FlyToProvince({ province }: { province: Province }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo([province.lat, province.lng], 6, {
        duration: 2
      });
    }, [province, map]);
    return null;
  }

  // Map bounds handler
  useEffect(() => {
    if (mapRef.current) {
      const mapBounds = mapRef.current.getBounds();
      setViewBounds({
        _northEast: mapBounds.getNorthEast(),
        _southWest: mapBounds.getSouthWest()
      });
    }
  }, []);

  // Register event handlers
  useEffect(() => {
    if (mapRef.current) {
      // Fix the onMoveend handler signature to accept an event parameter
      mapRef.current.on('moveend', function(e: L.LeafletEvent) {
        // Implementation of the moveend handler
        // This fixes the build error by explicitly accepting the event parameter
        if (mapRef.current) {
          const mapBounds = mapRef.current.getBounds();
          setViewBounds({
            _northEast: mapBounds.getNorthEast(),
            _southWest: mapBounds.getSouthWest()
          });
        }
      });
    }
  }, [mapRef.current]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <MapContainer 
          className="map" 
          center={[20, 0]} 
          zoom={2} 
          minZoom={2}
          maxZoom={7}
          style={{ height: '600px', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {geoJsonData && (
            <GeoJSON 
              data={geoJsonData} 
              style={provinceStyler}
              onEachFeature={provinceInteractions}
            />
          )}
          
          {/* Province Markers */}
          {provinces.map((province) => (
            <Marker 
              key={province.id} 
              position={[province.lat, province.lng]}
            >
              <Popup>
                <div className="font-medium">{province.name}</div>
                <div>Click to view details</div>
              </Popup>
            </Marker>
          ))}
          
          {/* Fly to Province Component */}
          {selectedProvince && <FlyToProvince province={selectedProvince} />}
        </MapContainer>
      </div>
      
      {/* Province Detail Card */}
      <div>
        <ProvinceDetailCard 
          province={selectedProvince} 
          onClose={() => setSelectedProvince(null)} 
        />
      </div>
    </div>
  );
};

export default ProvincesMap;
