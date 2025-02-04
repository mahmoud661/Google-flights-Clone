import axios from "axios";

const options = {
  method: "GET",
  url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
  params: {
    originSkyId: "LOND",
    destinationSkyId: "NYCA",
    originEntityId: "27544008",
    destinationEntityId: "27537542",
    cabinClass: "economy",
    adults: "1",
    sortBy: "best",
    currency: "USD",
    market: "en-US",
    countryCode: "US",
  },
  headers: {
    "x-rapidapi-key": "dbe0ee281dmshb9eaf39f9a7371dp15cf29jsn6e94620185c3",
    "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
  },
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}
