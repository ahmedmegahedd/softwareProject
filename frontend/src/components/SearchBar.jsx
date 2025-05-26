// src/components/SearchBar.jsx
import React, { useState } from 'react';

export default function SearchBar({ placeholder, onSearch, inputClassName = '' }) {
  const [value, setValue] = useState('');

  const handleInput = (e) => setValue(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value.trim());
    }
  };
  const handleButton = () => {
    if (onSearch) onSearch(value.trim());
  };

  return (
    <div className="flex-center my-4 w-full">
      <div className="card flex items-center w-full max-w-lg px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg">
        <svg
          className="w-6 h-6 text-gray-300 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none text-[#f0f0f0] placeholder-gray-400 text-lg ${inputClassName}`}
        />
        <button
          onClick={handleButton}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}
