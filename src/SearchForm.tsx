import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ArrowLeftRight, Users, ChevronDown, ArrowRightLeft, Loader2 } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { SearchParams } from './types/flight';
import getAirports from './services/getAirPorts';
import { searchFlights } from './services/SearchFlights';
import { 
  Box, 
  Paper, 
  IconButton, 
  Typography, 
  Button,
  Popover,
  Stack,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';

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

export const SearchForm: React.FC<Props> = ({ darkMode, onSearch }) => {
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePassengerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePassengerClose = () => {
    setAnchorEl(null);
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

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

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
      <Paper sx={{ p: 3, bgcolor: darkMode ? 'grey.900' : 'background.paper' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Button
            onClick={() => setTripType(tripType === 'round' ? 'one-way' : 'round')}
            startIcon={<ArrowLeftRight className="h-5 w-5" />}
            variant="text"
            color={darkMode ? 'inherit' : 'primary'}
          >
            {tripType === 'round' ? 'Round Trip' : 'One Way'}
          </Button>

          <Button
            onClick={handlePassengerClick}
            startIcon={<Users className="h-5 w-5" />}
            endIcon={<ChevronDown className="h-4 w-4" />}
            variant="text"
            color={darkMode ? 'inherit' : 'primary'}
          >
            {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}
          </Button>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePassengerClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                p: 2,
                width: 300,
                bgcolor: darkMode ? 'grey.900' : 'background.paper'
              }
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom color={darkMode ? 'common.white' : 'text.primary'}>
                  Adults (12+ years)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('adults', passengers.adults - 1)}
                    disabled={passengers.adults <= 1}
                  >
                    -
                  </IconButton>
                  <Typography color={darkMode ? 'common.white' : 'text.primary'}>
                    {passengers.adults}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('adults', passengers.adults + 1)}
                    disabled={passengers.adults >= 9}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom color={darkMode ? 'common.white' : 'text.primary'}>
                  Children (2-11 years)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('children', passengers.children - 1)}
                    disabled={passengers.children <= 0}
                  >
                    -
                  </IconButton>
                  <Typography color={darkMode ? 'common.white' : 'text.primary'}>
                    {passengers.children}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('children', passengers.children + 1)}
                    disabled={passengers.children >= 8}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom color={darkMode ? 'common.white' : 'text.primary'}>
                  Infants (Under 2 years)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('infants', passengers.infants - 1)}
                    disabled={passengers.infants <= 0}
                  >
                    -
                  </IconButton>
                  <Typography color={darkMode ? 'common.white' : 'text.primary'}>
                    {passengers.infants}
                  </Typography>
                  <IconButton 
                    size="small"
                    onClick={() => updatePassenger('infants', passengers.infants + 1)}
                    disabled={passengers.infants >= passengers.adults}
                  >
                    +
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Maximum 1 infant per adult
                </Typography>
              </Box>
            </Stack>
          </Popover>

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
        </Box>

        <Box sx={{ position: 'relative', mb: 3 }}>
          <div className="grid grid-cols-2 gap-2">
            <Box>
              <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'} sx={{ mb: 1, display: 'block' }}>
                From
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => handleFromSearch(e.target.value)}
                  className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city or airport"
                  required
                />
                {isLoadingAirports && from.length > 1 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                )}
                {fromSuggestions.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white dark:bg-[#303134] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {fromSuggestions.map((airport) => (
                      <button
                        key={airport.skyId}
                        type="button"
                        onClick={() => handleSelectFromAirport(airport)}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {airport.presentation.suggestionTitle} - {airport.presentation.subtitle}
                      </button>
                    ))}
                  </div>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color={darkMode ? 'grey.400' : 'text.secondary'} sx={{ mb: 1, display: 'block' }}>
                To
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => handleToSearch(e.target.value)}
                  className="w-full p-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city or airport"
                  required
                />
                {isLoadingAirports && to.length > 1 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                )}
                {toSuggestions.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white dark:bg-[#303134] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {toSuggestions.map((airport) => (
                      <button
                        key={airport.skyId}
                        type="button"
                        onClick={() => handleSelectToAirport(airport)}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {airport.presentation.suggestionTitle} - {airport.presentation.subtitle}
                      </button>
                    ))}
                  </div>
                )}
              </Box>
            </Box>
          </div>

          {/* Replaced MUI IconButton with Tailwind-styled button */}
          <button
            onClick={handleSwapLocations}
            className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full p-2 rounded-full border
              ${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </Box>

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
      </Paper>
    </form>
  );
};