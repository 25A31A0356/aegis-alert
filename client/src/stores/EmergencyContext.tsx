import React, { createContext, useContext, useState, useEffect } from 'react';
import { DisasterAlert, GeoCoordinate, SOSRequest, SafeBeacon, Shelter } from '@shared';
import { ApiService } from '../services/api';

export type DisasterScenario = 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'NORMAL';
export type SimulatedState = 'normal' | 'loading' | 'empty' | 'error' | 'offline';

export interface SectorPreset {
  id: string;
  name: string;
  location: GeoCoordinate;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  threatScore: number;
}

export const SECTOR_PRESETS: SectorPreset[] = [
  {
    id: 'vizag-coastal',
    name: 'Sector 12 - Coastal Beach Road, Visakhapatnam',
    location: {
      lat: 17.6868,
      lng: 83.2185,
      address: 'Beach Road, Coastal Ward 12, Visakhapatnam, AP',
      landmark: 'Near Light House Zone',
    },
    riskLevel: 'CRITICAL',
    threatScore: 84,
  },
  {
    id: 'delhi-yamuna',
    name: 'Sector 4B - East Flood Plain, Yamuna River, Delhi',
    location: {
      lat: 28.6139,
      lng: 77.209,
      address: 'Mayur Vihar Phase 1, Yamuna Basin, New Delhi',
      landmark: 'Old Railway Bridge Reach',
    },
    riskLevel: 'HIGH',
    threatScore: 76,
  },
  {
    id: 'chennai-coastal',
    name: 'Sector 7 - Marina Coastal Basin, Chennai, TN',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Mylapore - Santhome Belt, Chennai',
      landmark: 'Near Adyar Estuary',
    },
    riskLevel: 'MODERATE',
    threatScore: 55,
  },
  {
    id: 'shimla-ridge',
    name: 'Sector 3 - High Ridge Safety Zone, Shimla, HP',
    location: {
      lat: 31.1048,
      lng: 77.1734,
      address: 'The Mall & Ridge Plateau, Shimla',
      landmark: 'High Ground Bench',
    },
    riskLevel: 'LOW',
    threatScore: 18,
  },
];

interface EmergencyContextType {
  userLocation: GeoCoordinate;
  setUserLocation: (loc: GeoCoordinate) => void;
  selectedSectorId: string;
  setSelectedSectorId: (id: string) => void;
  activeSos: SOSRequest | null;
  setActiveSos: (sos: SOSRequest | null) => void;
  latestSafeBeacon: SafeBeacon | null;
  setLatestSafeBeacon: (beacon: SafeBeacon | null) => void;
  alerts: DisasterAlert[];
  shelters: Shelter[];
  selectedShelterId: string | null;
  setSelectedShelterId: (id: string | null) => void;
  scenario: DisasterScenario;
  setScenario: (sc: DisasterScenario) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isLoading: boolean;
  error: string | null;
  simulatedState: SimulatedState;
  setSimulatedState: (st: SimulatedState) => void;
  refreshEmergencyData: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('vizag-coastal');
  const currentSector = SECTOR_PRESETS.find((s) => s.id === selectedSectorId) || SECTOR_PRESETS[0];

  const [userLocation, setUserLocation] = useState<GeoCoordinate>(currentSector.location);
  const [activeSos, setActiveSos] = useState<SOSRequest | null>(null);
  const [latestSafeBeacon, setLatestSafeBeacon] = useState<SafeBeacon | null>(null);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<DisasterScenario>('FLOOD');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatedState, setSimulatedState] = useState<SimulatedState>('normal');

  // Keep location in sync when sector preset changes
  useEffect(() => {
    const matched = SECTOR_PRESETS.find((s) => s.id === selectedSectorId);
    if (matched) {
      setUserLocation(matched.location);
    }
  }, [selectedSectorId]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshEmergencyData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshEmergencyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [alertsRes, beaconRes, sheltersRes] = await Promise.all([
        ApiService.getAlerts(),
        ApiService.getLatestSafeBeacon(),
        ApiService.getShelters(),
      ]);

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data);
      }
      if (beaconRes.success && beaconRes.data) {
        setLatestSafeBeacon(beaconRes.data);
      }
      if (sheltersRes.success && sheltersRes.data) {
        setShelters(sheltersRes.data);
      }
    } catch (err: any) {
      console.warn('[EmergencyContext] Refresh error:', err);
      setError('Unable to reach emergency server. Operating on local cache.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        userLocation,
        setUserLocation,
        selectedSectorId,
        setSelectedSectorId,
        activeSos,
        setActiveSos,
        latestSafeBeacon,
        setLatestSafeBeacon,
        alerts,
        shelters,
        selectedShelterId,
        setSelectedShelterId,
        scenario,
        setScenario,
        isOnline,
        setIsOnline,
        isLoading,
        error,
        simulatedState,
        setSimulatedState,
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

