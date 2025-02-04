import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  tripType: 'round' | 'one-way';
  onChange: (type: 'round' | 'one-way') => void;
  darkMode: boolean;
}

export const TripTypeSelect: React.FC<Props> = ({ tripType, onChange, darkMode }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(tripType === 'round' ? 'one-way' : 'round')}
      className={`flex items-center space-x-2 ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      } text-sm font-medium`}
    >
      <ArrowLeftRight className="h-5 w-5" />
      <span>{tripType === 'round' ? 'Round Trip' : 'One Way'}</span>
    </button>
  );
};