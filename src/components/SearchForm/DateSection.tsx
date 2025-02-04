import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  departureDate: Date | null;
  setDepartureDate: (date: Date | null) => void;
  returnDate: Date | null;
  setReturnDate: (date: Date | null) => void;
  tripType: 'round' | 'one-way';
  darkMode: boolean;
}

export const DateSection: React.FC<Props> = ({
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  tripType,
  darkMode
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <DatePicker
          selected={departureDate}
          onChange={(date: Date) => setDepartureDate(date)}
          className={`w-full p-4 bg-transparent border rounded-lg ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholderText="Departure date"
          minDate={new Date()}
          required
        />
      </div>
      {tripType === 'round' && (
        <div>
          <DatePicker
            selected={returnDate}
            onChange={(date: Date) => setReturnDate(date)}
            className={`w-full p-4 bg-transparent border rounded-lg ${darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'} placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholderText="Return date"
            minDate={departureDate || new Date()}
          />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [tripType, setTripType] = useState<'round' | 'one-way'>('one-way');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className="p-4">
        <h1 className="text-2xl font-bold">Travel Planner</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle Dark Mode
        </button>
      </header>
      <main className="p-4">
        <DateSection
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          tripType={tripType}
          darkMode={darkMode}
        />
        <div>
          <label>
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={() => setTripType('one-way')}
            />
            One-way
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="round"
              checked={tripType === 'round'}
              onChange={() => setTripType('round')}
            />
            Round-trip
          </label>
        </div>
      </main>
    </div>
  );
};

export default App;
