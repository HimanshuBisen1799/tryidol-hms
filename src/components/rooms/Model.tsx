import React from 'react';

export const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-500">X</button>
        {children}
      </div>
    </div>
  );
};
