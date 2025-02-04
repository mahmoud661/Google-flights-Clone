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
  from: string;
  to: string;
  departureDate: Date;
  returnDate: Date | null;
  passengers: number;
  cabinClass: string;
  tripType: 'round' | 'one-way';
}

export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
}