import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Loader2 } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { SearchParams } from '../../types/flight';
import getAirports from '../../services/getAirPorts';
import { searchFlights } from '../../services/SearchFlights';
import { getHotels } from '../../services/GetHotels';
import { TripTypeSelect } from './TripTypeSelect';
import { PassengerSelect } from './PassengerSelect';
import { CabinClassSelector } from './CabinClassSelector';
import { LocationSection } from './LocationSection';
import { DateSection } from './DateSection';

interface Props {
  onSearch: (params: SearchParams) => void;
  darkMode: boolean;
}

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Location {
  skyId?: string;
  entityId: string;
  presentation?: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation?: {
    relevantFlightParams: {
      skyId: string;
      entityId: string;
    }
  };
  entityName?: string;
  hierarchy?: string;
}

const SearchForm: React.FC<Props> = ({ darkMode, onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [tripType, setTripType] = useState<'round' | 'one-way'>('round');
  const [cabinClass, setCabinClass] = useState('economy');
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [selectedFromLocation, setSelectedFromLocation] = useState<Location | null>(null);
  const [selectedToLocation, setSelectedToLocation] = useState<Location | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  const [hotelResults, setHotelResults] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });

  const debouncedSearchAirports = useCallback(
    debounce(async (query: string, setLoading: (loading: boolean) => void, setSuggestions: (suggestions: Location[]) => void) => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const response = await getAirports(query);
          if (response.status && response.data) {
            setSuggestions(response.data);
          }
        } catch (error) {
          console.error('Error fetching airports:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleFromSearch = (value: string) => {
    setFrom(value);
    if (selectedFromLocation) {
      setSelectedFromLocation(null);
    }
    debouncedSearchAirports(value, setIsLoadingFrom, setFromSuggestions);
  };

  const handleToSearch = (value: string) => {
    setTo(value);
    if (selectedToLocation) {
      setSelectedToLocation(null);
    }
    debouncedSearchAirports(value, setIsLoadingTo, setToSuggestions);
  };

  const handleSelectFromLocation = (location: Location) => {
    setSelectedFromLocation(location);
    setFrom(location.presentation?.suggestionTitle || `${location.entityName}`);
    setFromSuggestions([]);
  };

  const handleSelectToLocation = (location: Location) => {
    setSelectedToLocation(location);
    setTo(location.presentation?.suggestionTitle || `${location.entityName}`);
    setToSuggestions([]);
  };

  const handleSwapLocations = () => {
    const tempFromLocation = selectedFromLocation;
    const tempToLocation = selectedToLocation;
    const tempFrom = from;
    const tempTo = to;
    setSelectedFromLocation(tempToLocation);
    setSelectedToLocation(tempFromLocation);
    setFrom(tempTo);
    setTo(tempFrom);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const searchHotels = async (destination: Location) => {
    try {
      const response = await getHotels(destination.entityName || '');
      if (response.status && response.data) {
        setHotelResults(response.data);
        console.log('Hotel results:', response.data);
      }
    } catch (error) {
      console.error('Error searching hotels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate || !selectedFromLocation || !selectedToLocation) {
      console.error('Missing required fields');
      return;
    }
    setIsSearching(true);
    try {
      if (selectedFromLocation.navigation && selectedToLocation.navigation) {
        const searchParams = {
          originSkyId: selectedFromLocation.navigation.relevantFlightParams.skyId,
          destinationSkyId: selectedToLocation.navigation.relevantFlightParams.skyId,
          originEntityId: selectedFromLocation.navigation.relevantFlightParams.entityId,
          destinationEntityId: selectedToLocation.navigation.relevantFlightParams.entityId,
          date: departureDate.toISOString().split('T')[0],
          ...(returnDate && { returnDate: returnDate.toISOString().split('T')[0] }),
          cabinClass: cabinClass.toLowerCase().replace(' ', '-'),
          adults: passengers.adults.toString(),
          children: passengers.children.toString(),
          infants: passengers.infants.toString()
        };
        const results = await searchFlights(searchParams);
        onSearch(results);
        await searchHotels(selectedToLocation);
      }
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
          <TripTypeSelect tripType={tripType} onChange={setTripType} darkMode={darkMode} />
          <PassengerSelect
            passengers={passengers}
            onUpdatePassenger={(type, value) => setPassengers(prev => ({ ...prev, [type]: value }))}
            darkMode={darkMode}
          />
          <CabinClassSelector
            cabinClass={cabinClass}
            setCabinClass={setCabinClass}
            darkMode={darkMode}
            showClassMenu={showClassMenu}
            setShowClassMenu={setShowClassMenu}
          />
        </div>

        <LocationSection
          from={from}
          to={to}
          handleFromSearch={handleFromSearch}
          handleToSearch={handleToSearch}
          fromSuggestions={fromSuggestions}
          toSuggestions={toSuggestions}
          isLoadingFrom={isLoadingFrom}
          isLoadingTo={isLoadingTo}
          handleSelectFromLocation={handleSelectFromLocation}
          handleSelectToLocation={handleSelectToLocation}
          handleSwapLocations={handleSwapLocations}
          darkMode={darkMode}
        />

        <DateSection
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          tripType={tripType}
          darkMode={darkMode}
        />

        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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