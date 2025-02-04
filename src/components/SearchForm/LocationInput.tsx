import React from 'react';
import { Loader2 } from 'lucide-react';

interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (airport: Airport) => void;
  suggestions: Airport[];
  isLoading: boolean;
  darkMode: boolean;
  placeholder?: string;
}

export const LocationInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  onSelect,
  suggestions,
  isLoading,
  darkMode,
  placeholder = "Enter city or airport"
}) => {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-4 bg-transparent border rounded-lg 
            ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}
            placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder={placeholder}
          required
        />
        
        {isLoading && value.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}

        {suggestions.length > 0 && (
          <div className={`absolute w-full mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto
            ${darkMode ? 'bg-[#303134]' : 'bg-white'}`}>
            {suggestions.map((airport) => (
              <button
                key={airport.skyId}
                type="button"
                onClick={() => onSelect(airport)}
                className={`block w-full text-left px-4 py-2 
                  ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {airport.presentation.suggestionTitle} - {airport.presentation.subtitle}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};