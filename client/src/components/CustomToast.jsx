import React, { useEffect } from 'react';
import '../assets/css/CostumToast.css';

const CustomToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const displayedMessage =
    message === "Cannot read properties of null (reading '_id')"
      ? 'Veuillez vous connecter.' 
      : message;

  return (
    <div className={`custom-toast ${type}`}>
      <span>{displayedMessage}</span>
      <div className="progress-bar"></div>
    </div>
  );
};

export default CustomToast;
