import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);

 useEffect(() => {
    const token = localStorage.getItem('token'); // ou sessionStorage, selon ton projet

    fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUnreadCount(data.count);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des notifications :', err);
      });
  }, []);


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
          fontSize: '12px'
        }}>
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationIcon;
