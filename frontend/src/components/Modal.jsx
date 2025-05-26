// src/components/Modal.jsx
import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-neutral-900 rounded-2xl shadow-xl">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-white mb-4">
              {title}
            </h3>
          )}
          <div className="mt-2 text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
}
