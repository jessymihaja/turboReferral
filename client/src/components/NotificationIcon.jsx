import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { notificationService } from '../services';
import { UserContext } from '../contexts/UserContext';

const NotificationIcon = () => {
  const { user } = useContext(UserContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setErrorCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.count || 0);
        setErrorCount(0); // Reset error count on success
      } catch (err) {
        console.warn('Erreur lors de la récupération des notifications :', err.message);
        setErrorCount(prev => prev + 1);
        // Don't update unreadCount on error to keep last known value
      }
    };

    fetchUnreadCount();

    // Adaptive polling: increase interval on repeated errors
    const getPollingInterval = () => {
      if (errorCount === 0) return 30000; // 30s normal
      if (errorCount < 3) return 60000;   // 1min after some errors
      return 120000; // 2min after many errors
    };

    const interval = setInterval(fetchUnreadCount, getPollingInterval());

    return () => clearInterval(interval);
  }, [user, errorCount]);

  return (
    <Link to="/notifications" style={{ position: 'relative', display: 'inline-block' }}>
      <FaBell style={{ 
        fontSize: '18px', 
        color: errorCount > 2 ? '#999' : '#333' // Dim icon if many errors
      }}/>
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-10px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '10px'
        }}>
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationIcon;
