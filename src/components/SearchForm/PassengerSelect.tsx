import React, { useState } from 'react';
import { Users, ChevronDown } from 'lucide-react';

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Props {
  passengers: PassengerCounts;
  darkMode: boolean;
  onUpdatePassenger: (type: keyof PassengerCounts, value: number) => void;
}

export const PassengerSelect: React.FC<Props> = ({ passengers, darkMode, onUpdatePassenger }) => {
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        } text-sm font-medium`}
      >
        <Users className="h-5 w-5" />
        <span>{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full mt-2 w-72 ${
          darkMode ? 'bg-[#303134]' : 'bg-white'
        } rounded-lg shadow-lg p-4 z-50`}>
          {/* Adults */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Adults</h3>
                <p className="text-sm text-gray-500">12+ years</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('adults', passengers.adults - 1)}
                  disabled={passengers.adults <= 1}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  -
                </button>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{passengers.adults}</span>
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('adults', passengers.adults + 1)}
                  disabled={passengers.adults >= 9}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Children</h3>
                <p className="text-sm text-gray-500">2-11 years</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('children', passengers.children - 1)}
                  disabled={passengers.children <= 0}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  -
                </button>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{passengers.children}</span>
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('children', passengers.children + 1)}
                  disabled={passengers.children >= 8}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Infants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Infants</h3>
                <p className="text-sm text-gray-500">Under 2 years</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('infants', passengers.infants - 1)}
                  disabled={passengers.infants <= 0}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  -
                </button>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{passengers.infants}</span>
                <button
                  type="button"
                  onClick={() => onUpdatePassenger('infants', passengers.infants + 1)}
                  disabled={passengers.infants >= passengers.adults}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Maximum 1 infant per adult</p>
          </div>
        </div>
      )}
    </div>
  );
};