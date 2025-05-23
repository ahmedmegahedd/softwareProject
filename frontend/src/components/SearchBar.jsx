// src/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ placeholder, onSearch }) {
  return (
    <div className="flex-center my-4">
      <div className="card flex items-center w-full max-w-lg px-4 py-2">
        <svg
          className="w-6 h-6 text-secondary mr-3"
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
          onKeyDown={e => e.key === 'Enter' && onSearch && onSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-secondary"
        />
      </div>
    </div>
);
}
