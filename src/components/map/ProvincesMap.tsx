
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, ZoomControl } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { allProvinces } from '@/lib/provinces';
import type { Province } from '@/lib/types';
import { 
  provincesToGeoJSON,
  createProvinceStyler,
  createProvinceInteractions
} from '@/lib/map/province-geo-utils';
import 'leaflet/dist/leaflet.css';

// Define a custom marker icon using inline SVG
const createCustomIcon = (color: string) => {
  return new DivIcon({
    html: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const ProvincesMap: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // This helps ensure Leaflet only runs in the browser environment
    setIsMapLoaded(true);
  }, []);

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
        <div className="text-lg text-gray-600">Loading map...</div>
      </div>
    );
  }

  // Convert province data to GeoJSON
  const geojsonData = provincesToGeoJSON(allProvinces);
  
  // Create styler function
  const provinceStyle = createProvinceStyler(allProvinces);
  
  // Create interaction handlers
  const onEachFeature = createProvinceInteractions(allProvinces, setSelectedProvince);

  return (
    <div className="relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Add zoom controls to a better position */}
        <ZoomControl position="bottomright" />
        
        {/* Render province boundaries */}
        <GeoJSON 
          data={geojsonData} 
          style={provinceStyle}
          onEachFeature={onEachFeature}
        />
        
        {/* Render province markers */}
        {allProvinces.map((province) => (
          <Marker 
            key={province.id}
            position={[province.coordinates[1], province.coordinates[0]]} 
            icon={createCustomIcon(province.color)}
            eventHandlers={{
              click: () => setSelectedProvince(province)
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="font-medium">{province.name}</div>
              <div>Founded: {province.formation_date}</div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Province details panel */}
      {selectedProvince && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy">
              {selectedProvince.name}
              {selectedProvince.latinName && (
                <span className="block text-lg font-normal italic text-gray-600">
                  {selectedProvince.latinName}
                </span>
              )}
            </h2>
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: selectedProvince.color }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Overview</h3>
              <p className="text-gray-700 mb-4">{selectedProvince.description}</p>
              
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Founded:</span>
                  <span>{selectedProvince.formation_date}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Region:</span>
                  <span>{selectedProvince.region_expanded || selectedProvince.region}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Countries:</span>
                  <span>{selectedProvince.countries.join(', ')}</span>
                </div>
                {selectedProvince.patronSaint && (
                  <div className="flex">
                    <span className="font-medium w-32">Patron Saint:</span>
                    <span>{selectedProvince.patronSaint}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-medium w-32">Website:</span>
                  <a 
                    href={selectedProvince.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedProvince.website.replace(/(https?:\/\/)/, '')}
                  </a>
                </div>
                {selectedProvince.lay_website && (
                  <div className="flex">
                    <span className="font-medium w-32">Lay Dominican:</span>
                    <a 
                      href={selectedProvince.lay_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedProvince.lay_website.replace(/(https?:\/\/)/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">History & Mission</h3>
              <div className="space-y-3">
                {selectedProvince.description_array.map((paragraph, i) => (
                  <p key={i} className="text-gray-700">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {selectedProvince.priories && selectedProvince.priories.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Notable Priories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProvince.priories.map((priory, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-dominican-burgundy">
                      {priory.name}
                      {priory.isProvincialHouse && (
                        <span className="ml-2 text-xs bg-dominican-burgundy text-white px-2 py-0.5 rounded-full">
                          Provincial House
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{priory.location}</p>
                    <p className="text-xs text-gray-500">Founded: {priory.foundedYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attribution */}
          <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-right">
            Map data &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:underline">OpenStreetMap</a> contributors
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvincesMap;
