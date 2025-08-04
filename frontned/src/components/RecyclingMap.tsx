import React from 'react';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { Shopkeeper } from '../types';

interface RecyclingMapProps {
  shops: Shopkeeper[];
  wasteType: string;
}

const RecyclingMap: React.FC<RecyclingMapProps> = ({ shops, wasteType }) => {
  if (shops.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recycling Centers Found</h3>
        <p className="text-gray-500">
          We couldn't find any registered recycling centers for {wasteType} waste in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Navigation className="h-6 w-6 mr-2 text-blue-600" />
          Recycling Centers Map
        </h3>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {shops.length} locations found
        </span>
      </div>

      {/* Mock Map Display */}
      <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-64 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-opacity-20 bg-gray-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-500">Showing {wasteType} recycling centers</p>
          </div>
        </div>
        
        {/* Mock location pins */}
        {shops.slice(0, 3).map((shop, index) => (
          <div
            key={shop.id}
            className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              left: `${25 + index * 25}%`,
              top: `${40 + index * 10}%`,
            }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {shop.shopName}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
          <Navigation className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-blue-800">Get Directions</span>
        </button>
        
        <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
          <Phone className="h-6 w-6 text-green-600 mb-2" />
          <span className="text-sm font-medium text-green-800">Call Center</span>
        </button>
        
        <button className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors">
          <Clock className="h-6 w-6 text-yellow-600 mb-2" />
          <span className="text-sm font-medium text-yellow-800">Business Hours</span>
        </button>
        
        <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
          <MapPin className="h-6 w-6 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-800">View All</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Tip:</strong> Call ahead to confirm they accept {wasteType.toLowerCase()} waste and check their current operating hours.
        </p>
      </div>
    </div>
  );
};

export default RecyclingMap;