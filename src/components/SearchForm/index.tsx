import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { SearchParams } from '../../types/flight';
import getAirports from '../../services/getAirPorts';
import { searchFlights } from '../../services/SearchFlights';
import { TripTypeSelect } from './TripTypeSelect';
import { PassengerSelect } from './PassengerSelect';
import { LocationInput } from './LocationInput';

interface Props {
  onSearch: (params: SearchParams) => void;
  darkMode: boolean;
}

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    relevantFlightParams: {
      skyId: string;
      entityId: string;
    }
  };
}

const SearchForm: React.FC<Props> = ({ darkMode, onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [tripType, setTripType] = useState<'round' | 'one-way'>('round');
  const [cabinClass, setCabinClass] = useState('economy');
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [selectedFromAirport, setSelectedFromAirport] = useState<Airport | null>(null);
  const [selectedToAirport, setSelectedToAirport] = useState<Airport | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0
  });

  const handleFromSearch = async (value: string) => {
    setFrom(value);
    if (value.length > 1) {
      setIsLoadingAirports(true);
      try {
        const response = await getAirports(value);
        if (response.status && response.data) {
          setFromSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
        setFromSuggestions([]);
      } finally {
        setIsLoadingAirports(false);
      }
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToSearch = async (value: string) => {
    setTo(value);
    if (value.length > 1) {
      setIsLoadingAirports(true);
      try {
        const response = await getAirports(value);
        if (response.status && response.data) {
          setToSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
        setToSuggestions([]);
      } finally {
        setIsLoadingAirports(false);
      }
    } else {
      setToSuggestions([]);
    }
  };

  const handleSelectFromAirport = (airport: Airport) => {
    setSelectedFromAirport(airport);
    setFrom(airport.presentation.suggestionTitle);
    setFromSuggestions([]);
  };

  const handleSelectToAirport = (airport: Airport) => {
    setSelectedToAirport(airport);
    setTo(airport.presentation.suggestionTitle);
    setToSuggestions([]);
  };

  const handleSwapLocations = () => {
    const tempFromAirport = selectedFromAirport;
    const tempToAirport = selectedToAirport;
    const tempFrom = from;
    const tempTo = to;
    
    setSelectedFromAirport(tempToAirport);
    setSelectedToAirport(tempFromAirport);
    setFrom(tempTo);
    setTo(tempFrom);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const updatePassenger = (type: keyof PassengerCounts, value: number) => {
    const newValue = Math.max(
      type === 'adults' ? 1 : 0,
      Math.min(
        type === 'adults' ? 9 : 
        type === 'infants' ? passengers.adults : // Infants cannot exceed adults
        8,
        value
      )
    );

    setPassengers(prev => ({
      ...prev,
      [type]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate || !selectedFromAirport || !selectedToAirport) {
      console.error('Missing required fields');
      return;
    }

    setIsSearching(true);
    try {
      const searchParams = {
        originSkyId: selectedFromAirport.navigation.relevantFlightParams.skyId,
        destinationSkyId: selectedToAirport.navigation.relevantFlightParams.skyId,
        originEntityId: selectedFromAirport.navigation.relevantFlightParams.entityId,
        destinationEntityId: selectedToAirport.navigation.relevantFlightParams.entityId,
        date: departureDate.toISOString().split('T')[0],
        ...(returnDate && { returnDate: returnDate.toISOString().split('T')[0] }),
        cabinClass: cabinClass.toLowerCase().replace(' ', '-'),
        adults: passengers.adults.toString(),
        children: passengers.children.toString(),
        infants: passengers.infants.toString()
      };

      const results = await searchFlights(searchParams);
      onSearch(results);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-[#202124]' : 'bg-white'}`}>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <TripTypeSelect
            tripType={tripType}
            onChange={setTripType}
            darkMode={darkMode}
          />
          
          <PassengerSelect
            passengers={passengers}
            onUpdatePassenger={updatePassenger}
            darkMode={darkMode}
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClassMenu(!showClassMenu)}
              className={`flex items-center space-x-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } text-sm font-medium`}
            >
              <span className="capitalize">{cabinClass}</span>
              <span className="text-xs">▼</span>
            </button>
            
            {showClassMenu && (
              <div className={`absolute top-full mt-2 w-48 rounded-lg shadow-lg p-2 z-50 
                ${darkMode ? 'bg-[#303134]' : 'bg-white'}`}>
                {['economy', 'premium economy', 'business', 'first'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setCabinClass(cls);
                      setShowClassMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg capitalize
                      ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="From"
              value={from}
              onChange={handleFromSearch}
              onSelect={handleSelectFromAirport}
              suggestions={fromSuggestions}
              isLoading={isLoadingAirports}
              darkMode={darkMode}
            />

            <LocationInput
              label="To"
              value={to}
              onChange={handleToSearch}
              onSelect={handleSelectToAirport}
              suggestions={toSuggestions}
              isLoading={isLoadingAirports}
              darkMode={darkMode}
            />
          </div>

          <button
            type="button"
            onClick={handleSwapLocations}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow
              ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}
              hover:shadow-md transition-shadow`}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <DatePicker
              selected={departureDate}
              onChange={(date: Date) => setDepartureDate(date)}
              className={`w-full p-4 bg-transparent border rounded-lg
                ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}
                placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholderText="Departure date"
              minDate={new Date()}
              required
            />
          </div>

          {tripType === 'round' && (
            <div>
              <DatePicker
                selected={returnDate}
                onChange={(date: Date) => setReturnDate(date)}
                className={`w-full p-4 bg-transparent border rounded-lg
                  ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}
                  placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholderText="Return date"
                minDate={departureDate || new Date()}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed 
            flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <span>Search Flights</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;