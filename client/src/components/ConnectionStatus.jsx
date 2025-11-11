import React, { useState, useEffect } from 'react';
import { NetworkStatus } from '../utils/networkStatus';
import { API_URL } from '../config/constants';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(NetworkStatus.isOnline);
  const [serverOnline, setServerOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const removeListener = NetworkStatus.addListener(setIsOnline);

    // Check server health periodically
    const checkServer = async () => {
      const isHealthy = await NetworkStatus.checkServerHealth(API_URL);
      setServerOnline(isHealthy);
    };

    checkServer();
    const interval = setInterval(checkServer, 60000); // Check every minute

    return () => {
      removeListener();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Show status bar if there are connectivity issues
    setShowStatus(!isOnline || !serverOnline);
  }, [isOnline, serverOnline]);

  if (!showStatus) return null;

  const getStatusMessage = () => {
    if (!isOnline) return 'Pas de connexion Internet';
    if (!serverOnline) return 'Serveur temporairement indisponible';
    return '';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f44336',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '14px',
      zIndex: 9999,
      fontWeight: 500
    }}>
      {getStatusMessage()}
    </div>
  );
};

export default ConnectionStatus;