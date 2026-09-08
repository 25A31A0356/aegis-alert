// Shared TypeScript Data Models & Contracts for AegisAlert

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertTier = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export type HazardType =
  | 'Flood'
  | 'Cyclone'
  | 'Earthquake'
  | 'Lightning'
  | 'Heatwave'
  | 'Landslide'
  | 'Tsunami'
  | 'Urban Fire'
  | 'General Emergency';

export interface GeoCoordinate {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
  landmark?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  bloodGroup?: string;
  medicalConditions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferredLanguage: string;
  locationPreferences: {
    city: string;
    state: string;
    pincode: string;
    autoDetect: boolean;
  };
}

export interface DisasterAlert {
  id: string;
  title: string;
  hazardType: HazardType;
  severity: AlertTier;
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past';
  headline: string;
  description: string;
  instruction: string;
  affectedRegions: string[];
  effectiveFrom: string;
  expiresAt: string;
  issuedBy: string;
  isLive: boolean; // Distinguishes LIVE DATA from DEMO DATA
  coordinates?: GeoCoordinate;
}

export interface DisasterEvent {
  id: string;
  hazardType: HazardType;
  title: string;
  location: string;
  coordinates: GeoCoordinate;
  severity: SeverityLevel;
  status: 'ACTIVE' | 'MONITORING' | 'CONTAINED' | 'PAST';
  timestamp: string;
  details: string;
  affectedCount?: number;
  dataSource: 'DEMO DATA' | 'LIVE DATA';
}

export type SOSStatus =
  | 'SOS NOT ACTIVE'
  | 'SOS ACTIVATED'
  | 'LOCATION SHARED'
  | 'HELP REQUEST RECEIVED'
  | 'ASSISTANCE IN PROGRESS'
  | 'RESOLVED';

export interface SOSRequest {
  id: string;
  userId?: string;
  userName: string;
  contactNumber: string;
  emergencyType: HazardType | 'Trapped' | 'Medical' | 'Infrastructure Collapse' | 'Other';
  status: SOSStatus;
  coordinates: GeoCoordinate;
  trappedCount: number;
  hasElderlyOrInfants: boolean;
  hasMedicalEmergency: boolean;
  waterLevelMeters?: number;
  notes?: string;
  timestamp: string;
  updatedAt: string;
  estimatedArrival?: string;
}

export type SafeBeaconStatus = 'SAFE' | 'NEED HELP' | 'UNABLE TO MOVE';

export interface SafeBeacon {
  id: string;
  userId?: string;
  userName: string;
  status: SafeBeaconStatus;
  coordinates: GeoCoordinate;
  timestamp: string;
  notes?: string;
  isShared: boolean;
}

export type CommunityReportCategory =
  | 'Flooding'
  | 'Road blockage'
  | 'Fallen trees'
  | 'Infrastructure damage'
  | 'People needing assistance'
  | 'Shelter issues'
  | 'Other emergency situations'
  | 'Road Blockage'
  | 'Fallen Trees'
  | 'Infrastructure Damage'
  | 'People Needing Assistance'
  | 'Shelter Issues'
  | 'Other';

export type CommunityReportStatus = 'Submitted' | 'Under Review' | 'Verified' | 'Resolved';

export interface CommunityReport {
  id: string;
  category: CommunityReportCategory;
  title: string;
  description: string;
  location: string;
  coordinates: GeoCoordinate;
  severity: SeverityLevel;
  imageUrl?: string;
  status: CommunityReportStatus;
  upvotes: number;
  timestamp: string;
}

export interface Shelter {
  id: string;
  name: string;
  type: 'Government Cyclone Shelter' | 'Community Hall' | 'School / College' | 'Hospital Facility';
  location: string;
  coordinates: GeoCoordinate;
  totalCapacity: number;
  occupiedCapacity: number;
  availableCapacity: number;
  elevationMeters: number;
  amenities: {
    drinkingWater: boolean;
    medicalStation: boolean;
    powerBackup: boolean;
    foodSupply: boolean;
    sanitation: boolean;
  };
  contactPerson: string;
  contactNumber: string;
  status: 'OPEN' | 'NEAR_CAPACITY' | 'FULL' | 'CLOSED';
}

export type RouteSafetyStatus = 'Recommended Route' | 'Potentially Safer Route' | 'Route Affected' | 'Route Blocked';

export interface EvacuationRoute {
  id: string;
  name: string;
  origin: GeoCoordinate;
  destination: GeoCoordinate;
  destinationShelterId: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  safetyStatus: RouteSafetyStatus;
  hazardsEnRoute: string[];
  waypoints: [number, number][];
  isSimulated: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'DISASTER_ALERT' | 'EVACUATION_WARNING' | 'SHELTER_UPDATE' | 'COMMUNITY_UPDATE' | 'SYSTEM';
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}

export type HistoryActionType =
  | 'SOS_ACTIVATED'
  | 'SAFE_BEACON_SENT'
  | 'COMMUNITY_REPORT_SUBMITTED'
  | 'EVACUATION_ROUTE_VIEWED'
  | 'ASK_AEGIS_CONVERSATION'
  | 'ALERT_RECEIVED';

export interface HistoryEvent {
  id: string;
  actionType: HistoryActionType;
  title: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ChatSource = 'OFFLINE_KB' | 'ONLINE_AI';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aegis';
  text: string;
  timestamp: string;
  source: ChatSource;
  emergencyCategory?: HazardType | 'FirstAid' | 'Checklist';
  actionRecommendations?: string[];
}

export type DownloadStatus = 'Downloaded' | 'Available' | 'Updating';

export interface DownloadResource {
  id: string;
  title: string;
  category: 'Survival Guide' | 'Offline Maps' | 'Emergency Checklist';
  sizeBytes: number;
  sizeFormatted: string;
  status: DownloadStatus;
  lastUpdated: string;
  cachedUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    source?: 'DEMO DATA' | 'LIVE DATA' | 'LOCAL_DB' | 'OFFLINE_KB' | 'ONLINE_AI';
    timestamp?: string;
  };
}
