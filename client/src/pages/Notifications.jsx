import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../assets/css/Notifications.css';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services';
import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await notificationService.getAll(nextPage, 10);

      const newNotifications = data.data?.notifications || data.notifications || [];
      const pagination = data.data?.pagination || data.pagination;

      setNotifications(prev => [...prev, ...newNotifications]);
      setPage(nextPage);
      setHasMore(pagination?.hasMore || false);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications :', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getAll(1, 10);

        const initialNotifications = data.data?.notifications || data.notifications || [];
        const pagination = data.data?.pagination || data.pagination;

        setNotifications(initialNotifications);
        setHasMore(pagination?.hasMore || false);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreNotifications();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loadMoreNotifications]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationService.markAsRead(notification._id);
        setNotifications(notifications.map(n =>
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Erreur marquage comme lu', err);
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h2 style={{color:'#5D4037'}}>{t('notifications.myNotifications')}</h2>
      <p className="instruction-text">{t('notifications.clickToNavigate')}</p>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>{t('notifications.noNotifications')}</p>
        ) : (
          <>
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.link ? 'clickable' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  {!notification.isRead && <span className="unread-badge">Nouveau</span>}
                </div>
                <p className="notification-content">{notification.content}</p>
                <small className="notification-date">
                  {new Date(notification.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>
            ))}

            {hasMore && (
              <div ref={observerTarget} className="load-more-trigger">
                {loadingMore && (
                  <div className="loading-more">
                    <div className="spinner-small" />
                    <span>Chargement...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
