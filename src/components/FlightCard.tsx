import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface Props {
  flight: any; // assume flight now follows the search result structure
  darkMode: boolean;
}

export const FlightCard: React.FC<Props> = ({ flight, darkMode }) => {
  // Extract values from the search result structure
  const marketingCarrier = flight.legs[0].carriers.marketing[0];
  const firstSegment = flight.legs[0].segments[0];
  const lastLeg = flight.legs[flight.legs.length - 1];
  const departureTime = new Date(flight.legs[0].departure).toLocaleTimeString();
  const arrivalTime = new Date(lastLeg.arrival).toLocaleTimeString();
  const durationMinutes = flight.legs[0].durationInMinutes;
  const durationFormatted = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
  console.log('Flight:', flight);
  return (
    <div className="bg-white dark:bg-[#303134] rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <img
              src={marketingCarrier.logoUrl}
              alt={marketingCarrier.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-900 dark:text-white">
              {marketingCarrier.name}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Flight #{firstSegment.flightNumber}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {departureTime}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {flight.legs[0].origin.displayCode ||
                  flight.legs[0].origin.name}
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-[2px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <ArrowRight
                className="mx-2 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <div className="h-[2px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {arrivalTime}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {lastLeg.destination.displayCode || lastLeg.destination.name}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {durationFormatted}
          </span>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {flight.price.formatted}
          </div>
          <button className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};