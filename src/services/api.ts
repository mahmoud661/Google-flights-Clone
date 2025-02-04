import axios from 'axios';
import { SearchParams } from '../types/flight';
import { format } from 'date-fns';

const api = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v1',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
  }
});

interface AirportResponse {
  status: boolean;
  data: {
    current?: {
      presentation: {
        title: string;
        suggestionTitle: string;
        subtitle: string;
        entityId: string;
      };
    };
    nearby?: Array<{
      presentation: {
        title: string;
        suggestionTitle: string;
        subtitle: string;
        entityId: string;
      };
    }>;
  };
}

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  entityId: string;
}

export const searchNearbyAirports = async (query: string) => {
  console.log('searchNearbyAirports starting with query:', query);
  try {
    console.log('Making API request to searchAirport endpoint');
    const response = await api.get<AirportResponse>('/flights/searchAirport', {
      params: {
        query: query,
        locale: 'en-US'
      }
    });
    console.log('API response received:', response.data);

    const airports = [];
    console.log(response.data);
    // Add current location airport if available
    if (response.data?.data?.current?.presentation) {
      const current = response.data.data.current.presentation;
      airports.push({
        code: current.suggestionTitle.match(/\((.*?)\)/)?.[1] || '',
        name: current.title,
        city: current.title,
        country: current.subtitle,
        entityId: current.entityId
      });
    }

    // Add nearby airports
    if (response.data?.data?.nearby) {
      response.data.data.nearby.forEach(item => {
        const airport = item.presentation;
        airports.push({
          code: airport.suggestionTitle.match(/\((.*?)\)/)?.[1] || '',
          name: airport.title,
          city: airport.title,
          country: airport.subtitle,
          entityId: airport.entityId
        });
      });
    }

    return airports;
  } catch (error) {
    console.error('Error fetching nearby airports:', error);
    return [];
  }
};

export const searchFlights = async (params: SearchParams) => {
  try {
    const { from, to, departureDate, returnDate, passengers, cabinClass } = params;
    console.log('Raw input params:', params);

    // Try to get airport data either from object or by searching
    const getAirportData = async (input: string | Airport) => {
      if (typeof input === 'object' && input.entityId) {
        return input;
      }
      if (typeof input === 'string') {
        const airports = await searchNearbyAirports(input);
        const airport = airports[0];
        if (!airport) {
          throw new Error(`No airport found for: ${input}`);
        }
        return airport;
      }
      throw new Error('Invalid airport input');
    };

    const fromAirport = await getAirportData(from);
    const toAirport = await getAirportData(to);

    if (!fromAirport.entityId || !toAirport.entityId) {
      throw new Error('Invalid airport selection: Missing entityId');
    }

    const searchParams = {
      originSkyId: fromAirport.entityId,
      destinationSkyId: toAirport.entityId,
      date: format(departureDate, 'yyyy-MM-dd'),
      ...(returnDate && { returnDate: format(returnDate, 'yyyy-MM-dd') }),
      cabinClass: cabinClass.toLowerCase(),
      adults: passengers,
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    };

    console.log('Search params being sent to API:', searchParams);

    const response = await api.get('/flights/searchFlights', { params: searchParams });
    
    const itineraries = response.data?.data?.itineraries || [];
    
    return itineraries.map((itinerary: any) => {
      const leg = itinerary.legs[0];
      return {
        id: itinerary.id,
        airline: leg.carriers?.[0]?.name || 'Unknown Airline',
        flightNumber: leg.segments?.[0]?.flightNumber || 'N/A',
        departure: {
          airport: fromAirport.code,
          time: new Date(leg.departure).toLocaleTimeString(),
          city: fromAirport.city
        },
        arrival: {
          airport: toAirport.code,
          time: new Date(leg.arrival).toLocaleTimeString(),
          city: toAirport.city
        },
        price: itinerary.price.raw,
        duration: `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`,
        stops: leg.stopCount
      };
    });
  } catch (error) {
    console.error('Error fetching flights:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Invalid airport data format. Please select airports from the dropdown.');
    }
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    throw new Error('Failed to fetch flights. Please try again.');
  }
};

export const fetchAirports = async (query: string) => {
  if (!query || query.length < 2) {
    console.log('Query too short, returning empty array');
    return [];
  }

  try {
    console.log('fetchAirports called with query:', query);
    const airports = await searchNearbyAirports(query);
    console.log('Received airports:', airports);
    
    const filteredAirports = airports.filter(airport => 
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.code.toLowerCase().includes(query.toLowerCase())
    );
    console.log('Filtered airports:', filteredAirports);
    return filteredAirports;
  } catch (error) {
    console.error('Error in fetchAirports:', error);
    return [];
  }
};