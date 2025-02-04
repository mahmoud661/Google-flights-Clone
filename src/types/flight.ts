export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    city: string;
  };
  arrival: {
    airport: string;
    time: string;
    city: string;
  };
  price: number;
  duration: string;
  stops: number;
}

export interface SearchParams {
  from: string | Airport;  // Now accepts either a stringified Airport object or Airport object
  to: string | Airport;
  departureDate: Date;
  returnDate: Date | null;
  passengers: number;
  cabinClass: string;
  tripType: 'round' | 'one-way';
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  entityId: string;
}