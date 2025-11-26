import React, { useState, KeyboardEvent } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading, className = "" }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch(value);
    }
  };

  return (
    <div className={`w-full max-w-2xl relative z-20 px-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-xl p-1.5 flex items-center border border-gray-100 transform transition-transform hover:scale-[1.01]">
        <div className="pl-3 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Spanish restaurants, tapas, paella..."
          className="flex-1 p-2.5 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
          disabled={isLoading}
        />
        <button
          onClick={() => onSearch(value)}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm
            ${isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-spanish-dark text-white hover:bg-black active:transform active:scale-95 shadow-md hover:shadow-lg'}
          `}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Explore</span>}
        </button>
      </div>
      <div className="mt-3 flex gap-2 justify-center flex-wrap">
         <SuggestionChip label="Best Paella" onClick={() => onSearch("Best places for Paella")} />
         <SuggestionChip label="Cheap Tapas" onClick={() => onSearch("Affordable tapas bars")} />
         <SuggestionChip label="Romantic Date" onClick={() => onSearch("Romantic Spanish restaurants for a date")} />
         <SuggestionChip label="Basque Cheesecake" onClick={() => onSearch("Where to get the best Basque cheesecake")} />
      </div>
    </div>
  );
};

const SuggestionChip: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-spanish-yellow hover:text-spanish-dark hover:border-spanish-yellow transition-colors shadow-sm"
  >
    {label}
  </button>
);