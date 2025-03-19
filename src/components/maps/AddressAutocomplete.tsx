import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/maps-config";

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

const AddressAutocomplete = ({
  onAddressSelect,
  placeholder = "Enter address",
  defaultValue = "",
  className = "",
}: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<
    Array<{
      address: string;
      lat: number;
      lng: number;
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock function to simulate address suggestions
  const fetchAddressSuggestions = (input: string) => {
    if (!input.trim()) return [];

    // Mock data - in a real app, this would call a geocoding API
    const mockSuggestions = [
      {
        address: `${input} Main Street, Anytown, USA`,
        lat: 40.7128,
        lng: -74.006,
      },
      {
        address: `${input} Oak Avenue, Somewhere, USA`,
        lat: 34.0522,
        lng: -118.2437,
      },
      {
        address: `${input} Park Road, Elsewhere, USA`,
        lat: 41.8781,
        lng: -87.6298,
      },
    ];

    return mockSuggestions;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        const results = fetchAddressSuggestions(query);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setQuery(suggestion.address);
    setShowSuggestions(false);
    onAddressSelect(suggestion.address, suggestion.lat, suggestion.lng);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
        />
      </div>

      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{suggestion.address}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
