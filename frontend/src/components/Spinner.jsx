import React from 'react';

export default function Spinner() {
  return (
    <div className="flex-center flex-1">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}