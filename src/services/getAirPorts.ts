import axios from 'axios';

const getAirports = async (query: string) => {
  try {
    const response = await axios.get(
      "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
      {
        params: {
          query,
          locale: "en-US",
        },
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY as string,
          "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching airports:', error);
    throw error;
  }
};

export default getAirports;
