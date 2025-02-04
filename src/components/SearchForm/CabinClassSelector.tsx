import React from 'react';

interface Props {
  cabinClass: string;
  setCabinClass: (cls: string) => void;
  darkMode: boolean;
  showClassMenu: boolean;
  setShowClassMenu: (show: boolean) => void;
}

export const CabinClassSelector: React.FC<Props> = ({ cabinClass, setCabinClass, darkMode, showClassMenu, setShowClassMenu }) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowClassMenu(!showClassMenu)}
        className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium`}
      >
        <span className="capitalize">{cabinClass}</span>
        <span className="text-xs">▼</span>
      </button>
      {showClassMenu && (
        <div
          className={`absolute top-full mt-2 w-48 rounded-lg shadow-lg p-2 z-50 ${darkMode ? 'bg-[#303134]' : 'bg-white'}`}
        >
          {['economy', 'premium economy', 'business', 'first'].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => {
                setCabinClass(cls);
                setShowClassMenu(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-lg capitalize ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {cls}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
