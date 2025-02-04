import axios from "axios";

interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass: string;
  adults: string;
}

export const searchFlights = async (params: FlightSearchParams) => {
  try {
    const response = await axios.get(
      "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
      {
        params: {
          ...params,
          sortBy: "best",
          currency: "USD",
          market: "en-US",
          countryCode: "US",
        },
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY as string,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && response.data.data.itineraries) {
      return response.data.data.itineraries;
    } else if (response.data && response.data.status === false) {
      return response.data; // Return error details without throwing to prevent retries
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error searching flights:', error);
    throw new Error('Failed to fetch flights. Please try again.');
  }
};
