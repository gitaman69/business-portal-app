// Toast.jsx
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
      if (onClose) onClose();
    }, 5000); // The toast will disappear after 5 seconds

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [onClose]);

  if (!showToast) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;