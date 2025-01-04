'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/minicomp/input";
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AutocompleteProps {
  onSelect: (city: string) => void;
}

interface Suggestion {
  place_id: number;
  display_name: string;
}

export function Autocomplete({ onSelect }: AutocompleteProps) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.display_name);
    onSelect(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter city name"
        className={`bg-white ${theme === 'dark' ? 'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700' : 'text-gray-900 border-gray-300 placeholder-gray-500'}`}
        aria-label="City name"
        aria-autocomplete="list"
        aria-controls="city-suggestions"
        aria-expanded={showSuggestions}
      />
      {loading && (
        <Loader2 className={`absolute right-3 top-3 h-4 w-4 animate-spin ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} />
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="city-suggestions"
          ref={suggestionRef}
          className={`absolute z-10 mt-1 w-full ${theme === 'dark' ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-300'} rounded-md shadow-lg max-h-60 overflow-auto`}
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className={`px-4 py-2 hover:${theme === 'dark' ? 'dark:bg-gray-700' : 'bg-gray-100'} cursor-pointer ${theme === 'dark' ? 'dark:text-white' : 'text-gray-900'}`}
              role="option"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
