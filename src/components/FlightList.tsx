import React from 'react';
import { Flight } from '../types/flight';
import { FlightCard } from './FlightCard';
import { Globe } from 'lucide-react';

interface Props {
  flights: Flight[];
  loading: boolean;
  error: Error | null;
  darkMode: boolean;
}

export const FlightList: React.FC<Props> = ({ flights, loading, error, darkMode }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4">
        Error loading flights: {error.message}
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="space-y-8">
        <div className="text-xl font-medium text-gray-900 dark:text-white">
          Find cheap flights from Amman to anywhere
        </div>
        
        <div className="flex space-x-4">
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            Amman
          </span>
          <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            Aqaba
          </span>
        </div>

        <div className="relative rounded-lg overflow-hidden">
          <div className="aspect-[2/1] bg-gray-900">
            <Globe className="w-full h-full text-gray-800 dark:text-gray-700" />
          </div>
          <button className="absolute inset-0 flex items-center justify-center">
            <span className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium">
              Explore destinations
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} darkMode={darkMode} />
      ))}
    </div>
  );
};