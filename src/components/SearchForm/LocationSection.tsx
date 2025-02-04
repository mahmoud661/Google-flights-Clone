import React from 'react';
import { ArrowRightLeft, ArrowUpDown } from 'lucide-react';  // Added ArrowUpDown
import { LocationInput } from './LocationInput';

interface Props {
  from: string;
  to: string;
  handleFromSearch: (value: string) => void;
  handleToSearch: (value: string) => void;
  fromSuggestions: any[];
  toSuggestions: any[];
  isLoadingFrom: boolean;
  isLoadingTo: boolean;
  handleSelectFromLocation: (location: any) => void;
  handleSelectToLocation: (location: any) => void;
  handleSwapLocations: () => void;
  darkMode: boolean;
}

export const LocationSection: React.FC<Props> = ({
  from,
  to,
  handleFromSearch,
  handleToSearch,
  fromSuggestions,
  toSuggestions,
  isLoadingFrom,
  isLoadingTo,
  handleSelectFromLocation,
  handleSelectToLocation,
  handleSwapLocations,
  darkMode
}) => {
  return (
    <div className="relative mb-6">
      {/* Mobile view: stacked inputs with button in-between */}
      <div className="block md:hidden">
        <LocationInput
          label="From"
          value={from}
          onChange={handleFromSearch}
          onSelect={handleSelectFromLocation}
          suggestions={fromSuggestions}
          isLoading={isLoadingFrom}
          darkMode={darkMode}
        />
        <div className="flex justify-center my-2">
          <button
            type="button"
            onClick={handleSwapLocations}
            className={`p-2 rounded-full shadow ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} hover:shadow-md transition-shadow`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
        <LocationInput
          label="To"
          value={to}
          onChange={handleToSearch}
          onSelect={handleSelectToLocation}
          suggestions={toSuggestions}
          isLoading={isLoadingTo}
          darkMode={darkMode}
        />
      </div>

      {/* Desktop view: side-by-side inputs with absolute button */}
      <div className="hidden md:block relative">
        <div className="grid grid-cols-2 gap-4">
          <LocationInput
            label="From"
            value={from}
            onChange={handleFromSearch}
            onSelect={handleSelectFromLocation}
            suggestions={fromSuggestions}
            isLoading={isLoadingFrom}
            darkMode={darkMode}
          />
          <LocationInput
            label="To"
            value={to}
            onChange={handleToSearch}
            onSelect={handleSelectToLocation}
            suggestions={toSuggestions}
            isLoading={isLoadingTo}
            darkMode={darkMode}
          />
        </div>
        <button
          type="button"
          onClick={handleSwapLocations}
          className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} hover:shadow-md transition-shadow`}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
