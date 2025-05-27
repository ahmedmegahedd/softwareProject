// src/components/SearchBar.jsx
import React, { useState } from 'react';
import Lottie from 'lottie-react';
import searchAnimation from '../assets/lottie/search.json';

export default function SearchBar({ placeholder, onSearch, inputClassName = '', buttonClassName = '' }) {
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
    <div className="search-bar w-full max-w-2xl mx-auto">
      <span className="icon">
        <Lottie animationData={searchAnimation} loop autoplay style={{ width: 32, height: 32 }} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        style={{ minWidth: 0 }}
      />
      <button
        onClick={handleButton}
        className={buttonClassName}
      >
        Search
      </button>
    </div>
  );
}
