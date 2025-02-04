import axios from 'axios';

const getAirports = async (query: string) => {
  try {
    const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
      params: {
        query,
        locale: 'en-US'
      },
      headers: {
        'x-rapidapi-key': 'dbe0ee281dmshb9eaf39f9a7371dp15cf29jsn6e94620185c3',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching airports:', error);
    throw error;
  }
};

export default getAirports;
