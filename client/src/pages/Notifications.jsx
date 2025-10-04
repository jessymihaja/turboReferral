import React, { useEffect, useState } from 'react';
import '../assets/css/notifications.css';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll();
        setNotifications(data.data || data);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Erreur marquage comme lu', err);
    }
  };

  return (
    <div className="notifications-container">
  <h2 style={{color:'#5D4037'}}>Mes notifications</h2>
  <p className="instruction-text">Cliquez sur une notification pour la marquer comme lue</p>
  
  <div className="notifications-list">
    {notifications.length === 0 ? (
      <p>Aucune notification pour le moment.</p>
    ) : (
      notifications.map(notification => (
        <div
          key={notification._id}
          className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
          onClick={() => markAsRead(notification._id)}
        >
          <h4>{notification.title}</h4>
          <p>{notification.content}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      ))
    )}
  </div>
</div>

  );
};

export default Notifications;
