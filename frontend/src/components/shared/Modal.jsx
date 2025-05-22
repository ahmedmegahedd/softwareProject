import React from 'react';

const Modal = ({ title, children, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 border">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
