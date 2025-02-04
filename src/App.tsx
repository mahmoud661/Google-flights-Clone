import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { SearchForm } from "./components/SearchForm";
import { FlightList } from "./components/FlightList";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [flights, setFlights] = useState([]); // new state for search results

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-[#202124] transition-colors duration-200">
        <header className="bg-white dark:bg-[#202124] border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-medium text-gray-900 dark:text-white">
                  SkySearch
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://source.unsplash.com/1600x400/?airplane,sky"
                  alt="Airplane"
                  className="w-full h-64 object-cover rounded-lg opacity-20 dark:opacity-10"
                />
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
                  Find Your Next Flight
                </h1>
                <SearchForm darkMode={darkMode} onSearch={setFlights} />
              </div>
            </div>
          </div>

          {/* Render flights once available */}
          <FlightList flights={flights} loading={false} error={null} darkMode={darkMode} />
        </main>
      </div>
    </div>
  );
}

export default App;
