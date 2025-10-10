import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { notificationService } from '../services';
import { UserContext } from '../contexts/UserContext';

const NotificationIcon = () => {
  const { user } = useContext(UserContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.data?.count || data.count || 0);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    };

    fetchUnreadCount();

    // Rafraîchir le compteur toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);


  return (
    <Link to="/notifications" style={{ position: 'relative', display: 'inline-block' }}>
      <FaBell style={{ fontSize: '18px', color: '#333' }}/>
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
