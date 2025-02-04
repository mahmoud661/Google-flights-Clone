import axios from "axios";

interface HotelSearchResponse {
  status: boolean;
  data: any[];
}

export async function getHotels(query: string): Promise<HotelSearchResponse> {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel",
    params: { query },
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY as string,
      "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
}