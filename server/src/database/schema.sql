-- AegisAlert Database Schema (SQLite compatible, PostgreSQL migration ready)

PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_group TEXT,
  medical_conditions TEXT, -- JSON array string
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relation TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  city TEXT DEFAULT 'Visakhapatnam',
  state TEXT DEFAULT 'Andhra Pradesh',
  pincode TEXT DEFAULT '530001',
  auto_detect_location INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Disaster Alerts table (CAP Alerting compliant)
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  hazard_type TEXT NOT NULL,
  severity TEXT NOT NULL, -- RED, ORANGE, YELLOW, GREEN
  urgency TEXT NOT NULL, -- Immediate, Expected, Future, Past
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  instruction TEXT NOT NULL,
  affected_regions TEXT NOT NULL, -- JSON array string
  effective_from DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  issued_by TEXT NOT NULL,
  is_live INTEGER DEFAULT 0, -- 0: DEMO DATA, 1: LIVE DATA
  lat REAL,
  lng REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Disaster Events History / Active Events table
CREATE TABLE IF NOT EXISTS disaster_events (
  id TEXT PRIMARY KEY,
  hazard_type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL, -- ACTIVE, MONITORING, CONTAINED, PAST
  timestamp DATETIME NOT NULL,
  details TEXT NOT NULL,
  affected_count INTEGER DEFAULT 0,
  data_source TEXT DEFAULT 'DEMO DATA',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOS Emergency Requests table
CREATE TABLE IF NOT EXISTS sos_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  emergency_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SOS ACTIVATED',
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  address TEXT,
  landmark TEXT,
  trapped_count INTEGER DEFAULT 1,
  has_elderly_or_infants INTEGER DEFAULT 0,
  has_medical_emergency INTEGER DEFAULT 0,
  water_level_meters REAL DEFAULT 0,
  notes TEXT,
  estimated_arrival TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Safe Beacons (I Am Safe status updates)
CREATE TABLE IF NOT EXISTS safe_beacons (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL, -- SAFE, NEED HELP, UNABLE TO MOVE
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  address TEXT,
  is_shared INTEGER DEFAULT 1,
  notes TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crowdsourced Community Reports table
CREATE TABLE IF NOT EXISTS community_reports (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  severity TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted', -- Submitted, Under Review, Verified, Resolved
  upvotes INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evacuation Shelters table
CREATE TABLE IF NOT EXISTS shelters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  total_capacity INTEGER NOT NULL,
  occupied_capacity INTEGER DEFAULT 0,
  available_capacity INTEGER NOT NULL,
  elevation_meters REAL NOT NULL,
  drinking_water INTEGER DEFAULT 1,
  medical_station INTEGER DEFAULT 1,
  power_backup INTEGER DEFAULT 1,
  food_supply INTEGER DEFAULT 1,
  sanitation INTEGER DEFAULT 1,
  contact_person TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Evacuation Routes table
CREATE TABLE IF NOT EXISTS evacuation_routes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  origin_lat REAL NOT NULL,
  origin_lng REAL NOT NULL,
  destination_lat REAL NOT NULL,
  destination_lng REAL NOT NULL,
  destination_shelter_id TEXT,
  distance_km REAL NOT NULL,
  estimated_time_minutes INTEGER NOT NULL,
  safety_status TEXT NOT NULL, -- Recommended Route, Potentially Safer Route, Route Affected, Route Blocked
  hazards_en_route TEXT, -- JSON array string
  waypoints TEXT NOT NULL, -- JSON array of [lat, lng]
  is_simulated INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_shelter_id) REFERENCES shelters(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  link_action TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User History Audit Events table
CREATE TABLE IF NOT EXISTS history_events (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  metadata TEXT, -- JSON object string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages (Ask Aegis conversation history)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL, -- user, aegis
  text TEXT NOT NULL,
  source TEXT NOT NULL, -- OFFLINE_KB, ONLINE_AI
  emergency_category TEXT,
  action_recommendations TEXT, -- JSON array string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Downloadable Resources Cache table
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  size_formatted TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available', -- Downloaded, Available, Updating
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  cached_url TEXT
);
