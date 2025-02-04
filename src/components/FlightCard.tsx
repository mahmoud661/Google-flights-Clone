import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Flight } from '../types/flight';

interface Props {
  flight: Flight;
  darkMode: boolean;
}

export const FlightCard: React.FC<Props> = ({ flight, darkMode }) => {
  return (
    <div className="bg-white dark:bg-[#303134] rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <img
              src={`https://source.unsplash.com/50x50/?airline,${flight.airline}`}
              alt={flight.airline}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-900 dark:text-white">{flight.airline}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{flight.flightNumber}</div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{flight.departure.time}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{flight.departure.airport}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-[2px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <ArrowRight className="mx-2 text-gray-400 dark:text-gray-500" size={20} />
              <div className="h-[2px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{flight.arrival.time}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{flight.arrival.airport}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{flight.duration}</span>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${flight.price}</div>
          <button className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};