import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ArrowLeftRight, Users, ChevronDown, ArrowRightLeft } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { SearchParams } from '../types/flight';
import { fetchAirports } from '../services/api';
import getAirports from '../services/getAirPorts';

interface Props {
  onSearch: (params: SearchParams) => void;
  darkMode: boolean;
}

interface Airport {
  skyId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
}

export const SearchForm: React.FC<Props> = ({ onSearch, darkMode }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'round' | 'one-way'>('round');
  const [cabinClass, setCabinClass] = useState('economy');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showPassengersMenu, setShowPassengersMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);

  useEffect(() => {
    const loadAirports = async () => {
     
      console.log("hello")
    };
    loadAirports();
  }, []);

  const handleFromSearch = async (value: string) => {
    setFrom(value);
    if (value.length > 1) {
      try {
        const response = await getAirports(value);
        if (response.status && response.data) {
          setFromSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
        setFromSuggestions([]);
      }
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToSearch = async (value: string) => {
    setTo(value);
    if (value.length > 1) {
      try {
        const response = await getAirports(value);
        if (response.status && response.data) {
          setToSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
        setToSuggestions([]);
      }
    } else {
      setToSuggestions([]);
    }
  };

  const handleSwapLocations = () => {
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate) return;

    onSearch({
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      tripType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#303134] rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setTripType(tripType === 'round' ? 'one-way' : 'round')}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span>{tripType === 'round' ? 'Round Trip' : 'One Way'}</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassengersMenu(!showPassengersMenu)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 text-sm font-medium"
            >
              <Users className="h-5 w-5" />
              <span>{passengers} passenger{passengers !== 1 ? 's' : ''}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showPassengersMenu && (
              <div className="absolute top-full mt-2 w-48 bg-white dark:bg-[#303134] rounded-lg shadow-lg p-4 z-50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Passengers</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClassMenu(!showClassMenu)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 text-sm font-medium"
            >
              <span className="capitalize">{cabinClass}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showClassMenu && (
              <div className="absolute top-full mt-2 w-48 bg-white dark:bg-[#303134] rounded-lg shadow-lg p-4 z-50">
                {['economy', 'premium economy', 'business', 'first'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setCabinClass(cls);
                      setShowClassMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg capitalize"
                  >
                    {cls}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={from}
              onChange={(e) => handleFromSearch(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From where?"
              required
            />
            {fromSuggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white dark:bg-[#303134] rounded-lg shadow-lg z-50">
                {fromSuggestions.map((airport) => (
                  <button
                    key={airport.skyId}
                    type="button"
                    onClick={() => {
                      setFrom(airport.presentation.suggestionTitle);
                      setFromSuggestions([]);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {airport.presentation.suggestionTitle} - {airport.presentation.subtitle}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={to}
              onChange={(e) => handleToSearch(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To where?"
              required
            />
            {toSuggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white dark:bg-[#303134] rounded-lg shadow-lg z-50">
                {toSuggestions.map((airport) => (
                  <button
                    key={airport.skyId}
                    type="button"
                    onClick={() => {
                      setTo(airport.presentation.suggestionTitle);
                      setToSuggestions([]);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {airport.presentation.suggestionTitle} - {airport.presentation.subtitle}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSwapLocations}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white dark:bg-[#303134] rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 z-10"
          >
            <ArrowRightLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <DatePicker
              selected={departureDate}
              onChange={(date: Date) => setDepartureDate(date)}
              className={`w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              } placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholderText="Departure date"
              minDate={new Date()}
              required
            />
          </div>

          {tripType === 'round' && (
            <div className="space-y-1">
              <DatePicker
                selected={returnDate}
                onChange={(date: Date) => setReturnDate(date)}
                className={`w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                } placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholderText="Return date"
                minDate={departureDate || new Date()}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
};