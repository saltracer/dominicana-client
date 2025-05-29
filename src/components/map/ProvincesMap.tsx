
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
import { useTheme } from '@/context/ThemeContext';
import 'leaflet/dist/leaflet.css';

// Define a custom marker icon using inline SVG
const createCustomIcon = (color: string, isSelected: boolean = false) => {
  const size = isSelected ? 24 : 18;
  const strokeWidth = isSelected ? 3 : 2;
  const strokeColor = isSelected ? '#fff' : '#fff';
  const fillColor = isSelected ? '#f00' : color;
  
  return new DivIcon({
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${(size/2) - 2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
      </svg>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

// Component to handle dynamic tile layer updates
const DynamicTileLayer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  
  const tileUrl = resolvedTheme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  
  const attribution = resolvedTheme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <TileLayer
      key={resolvedTheme} // Force re-render when theme changes
      attribution={attribution}
      url={tileUrl}
    />
  );
};

const ProvincesMap: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    setIsMapLoaded(true);
  }, []);

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading map...</div>
      </div>
    );
  }

  // Convert province data to GeoJSON
  const geojsonData = provincesToGeoJSON(allProvinces);
  
  // Create styler function with selected province awareness
  const provinceStyle = createProvinceStyler(allProvinces, selectedProvince);
  
  // Create interaction handlers
  const onEachFeature = createProvinceInteractions(allProvinces, setSelectedProvince);

  return (
    <div className="relative">
      <MapContainer 
        key={`map-${resolvedTheme}`} // Force map re-render when theme changes
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
        zoomControl={false}
      >
        <DynamicTileLayer />
        
        <ZoomControl position="bottomright" />
        
        <GeoJSON 
          data={geojsonData as any} 
          style={provinceStyle}
          onEachFeature={onEachFeature}
        />
        
        {allProvinces.map((province) => (
          <Marker 
            key={province.id}
            position={[province.coordinates[0], province.coordinates[1]]} 
            icon={createCustomIcon(province.color, selectedProvince?.id === province.id)}
            eventHandlers={{
              click: () => setSelectedProvince(province)
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="font-medium">{province.name}</div>
              <div>Region: {province.region}</div>
              <div>Founded: {province.formation_date}</div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {selectedProvince && (
        <div className="mt-6 p-6 bg-white dark:bg-card rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-garamond text-2xl font-bold text-dominican-burgundy dark:text-foreground">
              {selectedProvince.name}
              {selectedProvince.latinName && (
                <span className="block text-lg font-normal italic text-gray-600 dark:text-gray-400">
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
              <h3 className="font-semibold text-lg mb-2 text-foreground">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProvince.description}</p>
              
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32 text-foreground">Founded:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedProvince.formation_date}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-foreground">Region:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedProvince.region_expanded || selectedProvince.region}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-foreground">Countries:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedProvince.countries.join(', ')}</span>
                </div>
                {selectedProvince.patronSaint && (
                  <div className="flex">
                    <span className="font-medium w-32 text-foreground">Patron Saint:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedProvince.patronSaint}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-medium w-32 text-foreground">Website:</span>
                  <a 
                    href={selectedProvince.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedProvince.website.replace(/(https?:\/\/)/, '')}
                  </a>
                </div>
                {selectedProvince.lay_website && (
                  <div className="flex">
                    <span className="font-medium w-32 text-foreground">Lay Dominican:</span>
                    <a 
                      href={selectedProvince.lay_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedProvince.lay_website.replace(/(https?:\/\/)/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">History & Mission</h3>
              <div className="space-y-3">
                {selectedProvince.description_array.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {selectedProvince.priories && selectedProvince.priories.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2 text-foreground">Notable Priories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProvince.priories.map((priory, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-muted p-3 rounded-md">
                    <h4 className="font-medium text-dominican-burgundy dark:text-foreground">
                      {priory.name}
                      {priory.isProvincialHouse && (
                        <span className="ml-2 text-xs bg-dominican-burgundy text-white px-2 py-0.5 rounded-full">
                          Provincial House
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{priory.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Founded: {priory.founded}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-border text-xs text-gray-500 dark:text-gray-400 text-right">
            Map data &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:underline">OpenStreetMap</a> contributors
            {resolvedTheme === 'dark' && (
              <span> &copy; <a href="https://carto.com/attributions" className="hover:underline">CARTO</a></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvincesMap;
