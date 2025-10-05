import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import '../assets/css/CostumToast.css';

const CustomToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const displayedMessage =
    message === "Cannot read properties of null (reading '_id')"
      ? 'Please sign in' 
      : message;

  const getIcon = () => {
    switch(type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaExclamationCircle />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <div className={`custom-toast ${type}`}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {getIcon()}
        {displayedMessage}
      </span>
      <div className="progress-bar"></div>
    </div>
  );
};

export default CustomToast;
