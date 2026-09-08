import React, { createContext, useContext, useState, useEffect } from 'react';
import { DisasterAlert, GeoCoordinate, SOSRequest, SafeBeacon } from '@shared';
import { ApiService } from '../services/api';

interface EmergencyContextType {
  userLocation: GeoCoordinate;
  setUserLocation: (loc: GeoCoordinate) => void;
  activeSos: SOSRequest | null;
  setActiveSos: (sos: SOSRequest | null) => void;
  latestSafeBeacon: SafeBeacon | null;
  setLatestSafeBeacon: (beacon: SafeBeacon | null) => void;
  alerts: DisasterAlert[];
  isOnline: boolean;
  refreshEmergencyData: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<GeoCoordinate>({
    lat: 17.6868,
    lng: 83.2185,
    address: 'Visakhapatnam, Andhra Pradesh',
    landmark: 'Coastal Sector',
  });

  const [activeSos, setActiveSos] = useState<SOSRequest | null>(null);
  const [latestSafeBeacon, setLatestSafeBeacon] = useState<SafeBeacon | null>(null);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial fetch
    refreshEmergencyData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshEmergencyData = async () => {
    try {
      const [alertsRes, beaconRes] = await Promise.all([
        ApiService.getAlerts(),
        ApiService.getLatestSafeBeacon(),
      ]);

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data);
      }
      if (beaconRes.success && beaconRes.data) {
        setLatestSafeBeacon(beaconRes.data);
      }
    } catch (err) {
      console.warn('[EmergencyContext] Refresh error:', err);
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        userLocation,
        setUserLocation,
        activeSos,
        setActiveSos,
        latestSafeBeacon,
        setLatestSafeBeacon,
        alerts,
        isOnline,
        refreshEmergencyData,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
