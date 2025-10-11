import React, { createContext, useState, useContext } from 'react';

const MaintenanceContext = createContext(null);

export function MaintenanceProvider({ children }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const enableMaintenanceMode = () => {
    setIsMaintenanceMode(true);
  };

  const disableMaintenanceMode = () => {
    setIsMaintenanceMode(false);
  };

  return (
    <MaintenanceContext.Provider
      value={{ isMaintenanceMode, enableMaintenanceMode, disableMaintenanceMode }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
}
