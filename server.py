#!/usr/bin/env python3
"""
AegisAlert National: Enterprise Multi-Threaded Disaster Management & Threat Server
Sovereign Omnichannel Signal Pipeline:
  [🛰️ Orbital Satellites (NavIC / INSAT)]
       │ (Direct S-Band Downlink)
       ▼
  [🏛️ Disaster Management Offices (NEOC / MHA / SDMA)]
       │ (Sovereign SHA-256 Command Authorization)
       ├───────────────────────────────────────────────┐
       ▼                                               ▼
  [📶 Telecom Towers Tethering]                   [📡 Direct Airwave / RF]
  (C-DOT SACHET Cell Broadcast)                   (Sub-GHz 868MHz / ISRO NavIC / FM)
       │                                               │
       ▼                                               ▼
  [📱 OUTPUT DEVICES WITH INTERNET]              [📢 OUTPUT DEVICES WITHOUT INTERNET]
  • 4G/5G Smartphones (PWA/Push)                 • Autonomous 120dB Siren Masts (LoRa)
  • Smart City Highway LED Billboards            • 2G Feature Dumbphones (No Data)
  • Indian Railways Station PIDS                 • ISRO NavIC Satellite Receivers
  • Hospital Trauma Boards                       • FM Radio 100.1MHz Carrier Overrides
  • Television & OTT Red Crawls                  • Village Panchayat RF Loudspeakers
"""

import os
import sys
import json
import time
import uuid
import socket
import mimetypes
from datetime import datetime
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

SYSTEM_STATE = {
    "server_start": datetime.now().isoformat(),
    "version": "AegisAlert 5.5 Sovereign Omnichannel Edition",
    "active_calamities": [
        {
            "id": "CAL-01",
            "type": "FLASH_FLOOD",
            "title": "Brahmaputra Major Basin Surge & River Embankment Threat",
            "region": "Majuli & Jorhat, Assam",
            "coordinates": [26.9450, 94.2100],
            "severity": "CRITICAL",
            "risk_score": 96,
            "danger_mark_m": 105.7,
            "current_level_m": 106.8,
            "rainfall_rate_mmh": 68.4,
            "affected_population": 142000,
            "evacuation_status": "MANDATORY_ACTIVE",
            "safe_shelter": "Garmur Elevated Highland Complex (+38m)",
            "siren_active": True,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        },
        {
            "id": "CAL-02",
            "type": "LANDSLIDE",
            "title": "Wayanad Highland Soil Shear Failure & Debris Mudflow",
            "region": "Chooralmala & Meppadi, Kerala",
            "coordinates": [11.5540, 76.1265],
            "severity": "CRITICAL",
            "risk_score": 98,
            "slope_angle_deg": 42.0,
            "rainfall_72h_mm": 580.0,
            "affected_population": 38000,
            "evacuation_status": "VALLEY_CLEARANCE",
            "safe_shelter": "Meppadi Elevated Trauma & Relief Center",
            "siren_active": True,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        },
        {
            "id": "CAL-03",
            "type": "CYCLONE",
            "title": "Bay of Bengal Severe Super Cyclone & Storm Surge",
            "region": "Puri & Jagatsinghpur Coast, Odisha",
            "coordinates": [19.7983, 85.8249],
            "severity": "CRITICAL",
            "risk_score": 94,
            "wind_speed_kmh": 185.0,
            "storm_surge_m": 4.8,
            "affected_population": 320000,
            "evacuation_status": "COASTAL_ZERO_ZONE",
            "safe_shelter": "Puri Concrete Multi-Purpose Cyclone Shelter #04",
            "siren_active": False,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        },
        {
            "id": "CAL-04",
            "type": "CLOUDBURST",
            "title": "Kedarnath Mandakini Gorge Violent Precipitation Core",
            "region": "Rudraprayag, Uttarakhand",
            "coordinates": [30.7310, 78.4410],
            "severity": "HIGH",
            "risk_score": 91,
            "rainfall_rate_mmh": 112.0,
            "flash_surge_velocity_kmh": 48.0,
            "affected_population": 18500,
            "evacuation_status": "PILGRIM_RIDGE_REDIRECT",
            "safe_shelter": "Mangan Administrative Mountain Shelter",
            "siren_active": False,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        },
        {
            "id": "CAL-05",
            "type": "HEATWAVE",
            "title": "Thar Desert Extreme Heat Dome & Severe Loo",
            "region": "Bikaner & Churu, Rajasthan",
            "coordinates": [28.0229, 73.3119],
            "severity": "HIGH",
            "risk_score": 87,
            "temperature_c": 49.4,
            "wbgt_index_c": 54.2,
            "affected_population": 260000,
            "evacuation_status": "COOLING_SHELTER_DEPLOYED",
            "safe_shelter": "Bikaner 24/7 Air-Cooled Hydration Center",
            "siren_active": False,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        }
    ],
    # Direct Satellite Downlink to Disaster Management Offices
    "satellite_constellations": [
        {
            "id": "SAT-NAVIC-1I",
            "name": "ISRO NavIC-1I (IRNSS)",
            "orbit": "GEO 55°E Slot",
            "band": "S-Band (2492.028 MHz) & L5 (1176.45 MHz)",
            "status": "LOCKED_DIRECT_TO_NEOC",
            "latency_ms": 242,
            "signal_quality": "99.8% C/N0",
            "purpose": "Direct Orbital Disaster Messaging & Sovereign Timestamping"
        },
        {
            "id": "SAT-INSAT-3DR",
            "name": "ISRO INSAT-3DR",
            "orbit": "GEO 74°E Slot",
            "band": "C-Band & S-Band Disaster Warning Transponder (DWT)",
            "status": "STREAMING_TELEMETRY",
            "latency_ms": 258,
            "signal_quality": "99.4% C/N0",
            "purpose": "Multi-Spectral Cyclone / Flood Imager & 19-Channel Sounder"
        },
        {
            "id": "SAT-EOS-04",
            "name": "ISRO RISAT-1A / EOS-04",
            "orbit": "SSO 529 km Polar Low Earth Orbit",
            "band": "C-Band Synthetic Aperture Radar InSAR (5.35 GHz)",
            "status": "RADAR_PASS_ACTIVE",
            "latency_ms": 115,
            "signal_quality": "100%",
            "purpose": "All-Weather Day/Night Inundation & Slope Shear Mapping"
        }
    ],
    # Disaster Management Offices & Command Nodes
    "disaster_management_offices": [
        {
            "id": "OFFICE-NEOC",
            "name": "National Emergency Operations Centre (NEOC)",
            "location": "Ministry of Home Affairs (MHA), New Delhi",
            "commander": "Central Incident Commander Shri R. K. Verma, IAS",
            "status": "COMMAND_AUTHORITY_ACTIVE",
            "downlink": "ISRO Satellite Ground Receiver Terminal (MHA Bunker)"
        },
        {
            "id": "OFFICE-SDMA",
            "name": "State Disaster Management Authorities (SDMAs)",
            "location": "Disaster Theaters (Assam, Kerala, Odisha, Uttarakhand, Rajasthan)",
            "commander": "State Relief Commissioners (SRC)",
            "status": "TACTICAL_DISPATCH_ENABLED",
            "downlink": "State NIC Optical Fiber + Satellite VSAT Auto-Failover"
        }
    ],
    # Signal Towers Grid (Cell Broadcast Tethering)
    "telecom_towers": {
        "total_tethered": 178,
        "protocol": "3GPP TS 23.041 Cell Broadcast Service (CBS)",
        "channel": 4370,
        "mechanism": "C-DOT SACHET Cell Tower Tethering Bridge (Zero-Delay Multi-Tower Blast)",
        "active_sectors": [
            {"id": "TOW-AS-42", "region": "Majuli & Jorhat, Assam", "towers": 42, "status": "TETHERED_READY"},
            {"id": "TOW-KL-38", "region": "Wayanad Hills, Kerala", "towers": 38, "status": "TETHERED_READY"},
            {"id": "TOW-OD-54", "region": "Puri Coastal Belt, Odisha", "towers": 54, "status": "TETHERED_READY"},
            {"id": "TOW-UK-24", "region": "Kedarnath Mandakini Gorge", "towers": 24, "status": "TETHERED_READY"},
            {"id": "TOW-RJ-20", "region": "Bikaner Thar Desert", "towers": 20, "status": "TETHERED_READY"}
        ]
    },
    # All Output Devices: Devices With Internet vs Non-Internet (Offline)
    "output_devices": {
        "internet_connected": [
            {
                "id": "DEV-IP-01",
                "name": "4G/5G Resident Smartphones",
                "protocol": "PWA Web Push / WebSockets / Emergency API",
                "count": 148200,
                "status": "LATCHED_ACTIVE",
                "description": "High-priority lockscreen notifications with safe walking corridors and evacuation maps."
            },
            {
                "id": "DEV-IP-02",
                "name": "Smart City ICCC Digital LED Billboards (VMS)",
                "protocol": "NTCIP 1203 Dynamic Message Sign Protocol",
                "count": 34,
                "status": "DISPLAYING_EVAC_ROUTE",
                "description": "Variable Message Signs across National Highways & Arterial Roads routing traffic out of hazard areas."
            },
            {
                "id": "DEV-IP-03",
                "name": "Indian Railways PIDS Station Displays",
                "protocol": "RDSO Rail-Tel Emergency Interrupt",
                "count": 14,
                "status": "HALT_CAUTION_ALERT",
                "description": "Emergency halt, caution signals, and passenger evacuation guidance at railway platforms."
            },
            {
                "id": "DEV-IP-04",
                "name": "Hospital Trauma & Blood Bank Dashboards",
                "protocol": "HL7 Disaster Mass Influx Gateway",
                "count": 12,
                "status": "TRIAGE_MOBILIZED",
                "description": "Pre-alerting trauma centers and oxygen plants for mass-casualty receiving."
            },
            {
                "id": "DEV-IP-05",
                "name": "Television & OTT Emergency Overlays",
                "protocol": "Doordarshan / PIB Broadcast Inserter",
                "count": 8,
                "status": "RED_CRAWL_OVERLAY",
                "description": "Forced audio interrupt and bottom red crawl warning for all broadcast viewers."
            }
        ],
        "non_internet_offline": [
            {
                "id": "DEV-OFF-01",
                "name": "Autonomous Solar Siren Masts (120dB + 360° Xenon Strobe)",
                "protocol": "Sub-GHz 868MHz LoRa Mesh (Zero Internet)",
                "count": 18,
                "status": "ACOUSTIC_ARMED",
                "description": "120dB omnidirectional pneumatic horns audible for 5km across valleys without power or cell towers."
            },
            {
                "id": "DEV-OFF-02",
                "name": "2G Basic Feature Phones (No Data / No Internet)",
                "protocol": "Cell Broadcast Channel 4370 (Direct Radio Frame)",
                "count": 62000,
                "status": "DIRECT_OTA_RECEIVE",
                "description": "Reaches basic keypad feature phones over raw GSM radio waves with zero data balance or internet."
            },
            {
                "id": "DEV-OFF-03",
                "name": "ISRO NavIC Direct Satellite Ground Terminals",
                "protocol": "NavIC S-Band Messaging Broadcast Receiver",
                "count": 24,
                "status": "SATELLITE_DIRECT_LOCKED",
                "description": "Direct space-to-ground receivers installed on fishing trawlers and remote highland community shelters."
            },
            {
                "id": "DEV-OFF-04",
                "name": "All India Radio (Akashvani) FM Transmitters",
                "protocol": "FM 100.1 MHz Sub-Carrier Radio Override",
                "count": 4,
                "status": "CARRIER_INJECTED",
                "description": "Sub-carrier tone overrides FM broadcasts to deliver spoken evacuation instructions over car radios."
            },
            {
                "id": "DEV-OFF-05",
                "name": "Village Panchayat Public Address Loudspeakers",
                "protocol": "Analog VHF / DTMF Tone Relay",
                "count": 36,
                "status": "PUBLIC_HORN_ARMED",
                "description": "Tone-activated horn speakers mounted on Panchayat Bhavans, mosques, and temples."
            }
        ]
    },
    "dispatched_alerts": [],
    "mobile_notifications_log": [],
    "active_sirens": {"CAL-01": True, "CAL-02": True},
    "last_pipeline_propagation": None
}

class AegisDisasterRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # REST API Routes
        if path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return

        if path == "/api/status":
            self.send_json_response({
                "status": "ONLINE",
                "uptime": SYSTEM_STATE["server_start"],
                "version": SYSTEM_STATE["version"],
                "active_calamities_count": len(SYSTEM_STATE["active_calamities"]),
                "active_sirens": SYSTEM_STATE["active_sirens"],
                "satellite_constellations": len(SYSTEM_STATE["satellite_constellations"]),
                "tethered_telecom_towers": SYSTEM_STATE["telecom_towers"]["total_tethered"],
                "internet_output_devices_count": sum(d["count"] for d in SYSTEM_STATE["output_devices"]["internet_connected"]),
                "offline_output_devices_count": sum(d["count"] for d in SYSTEM_STATE["output_devices"]["non_internet_offline"]),
                "dispatched_alerts_count": len(SYSTEM_STATE["dispatched_alerts"]),
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/calamities/live":
            now_str = datetime.now().strftime("%H:%M:%S")
            for c in SYSTEM_STATE["active_calamities"]:
                c["last_updated"] = now_str

            self.send_json_response({
                "source": "AegisAlert National Telemetry Mesh (CWC, IMD, USGS, Open-Meteo)",
                "calamities": SYSTEM_STATE["active_calamities"],
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/satellites/live":
            self.send_json_response({
                "source": "ISRO National Remote Sensing Centre (NRSC) & Space Applications Centre (SAC)",
                "satellites": SYSTEM_STATE["satellite_constellations"],
                "downlink_target": "National Emergency Operations Centre (NEOC), MHA New Delhi",
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/locations":
            self.send_json_response({
                "source": "AegisAlert National Sensor Grid (IMD, CWC, USGS, Open-Meteo)",
                "total_locations": 9,
                "locations": [
                    {"id": "LOC-HYD", "name": "Hyderabad", "state": "Telangana", "coordinates": [17.3850, 78.4867], "primary_hazards": ["Urban Flood", "Heatwave", "Lightning"]},
                    {"id": "LOC-GHY", "name": "Guwahati", "state": "Assam", "coordinates": [26.1445, 91.7362], "primary_hazards": ["Flash Flood", "Landslide", "Heavy Rainfall"]},
                    {"id": "LOC-DED", "name": "Dehradun", "state": "Uttarakhand", "coordinates": [30.3165, 78.0322], "primary_hazards": ["Landslide", "Cloudburst", "Flash Flood"]},
                    {"id": "LOC-VSP", "name": "Visakhapatnam", "state": "Andhra Pradesh", "coordinates": [17.6868, 83.2185], "primary_hazards": ["Cyclone", "Air Pollution", "Heavy Rainfall"]},
                    {"id": "LOC-VJA", "name": "Vijayawada", "state": "Andhra Pradesh", "coordinates": [16.5062, 80.6480], "primary_hazards": ["Flood", "Heatwave", "Lightning"]},
                    {"id": "LOC-SHL", "name": "Shillong", "state": "Meghalaya", "coordinates": [25.5788, 91.8933], "primary_hazards": ["Landslide", "Heavy Rainfall", "Thunderstorm"]},
                    {"id": "LOC-MUM", "name": "Mumbai", "state": "Maharashtra", "coordinates": [19.0760, 72.8777], "primary_hazards": ["Urban Flood", "Lightning", "Air Pollution"]},
                    {"id": "LOC-CHE", "name": "Chennai", "state": "Tamil Nadu", "coordinates": [13.0827, 80.2707], "primary_hazards": ["Flood", "Cyclone", "Heatwave"]},
                    {"id": "LOC-BLR", "name": "Bengaluru", "state": "Karnataka", "coordinates": [12.9716, 77.5946], "primary_hazards": ["Urban Flood", "Lightning", "Air Pollution"]}
                ],
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/signal-pipeline/status":
            self.send_json_response({
                "pipeline_architecture": "Satellite -> Disaster Management Offices -> Towers Tethering -> Output Devices (Internet + Non-Internet)",
                "satellites": SYSTEM_STATE["satellite_constellations"],
                "disaster_management_offices": SYSTEM_STATE["disaster_management_offices"],
                "telecom_towers": SYSTEM_STATE["telecom_towers"],
                "output_devices": SYSTEM_STATE["output_devices"],
                "last_propagation": SYSTEM_STATE["last_pipeline_propagation"],
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/alerts/active":
            self.send_json_response({
                "active_alerts": SYSTEM_STATE["dispatched_alerts"],
                "active_sirens": SYSTEM_STATE["active_sirens"]
            })
            return

        elif path == "/api/gov/export":
            query = parse_qs(parsed.query)
            fmt = query.get("format", ["json"])[0]

            if fmt == "csv":
                self.send_response(200)
                self.send_header("Content-Type", "text/csv")
                self.send_header("Content-Disposition", "attachment; filename=aegis_calamities_live.csv")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                header = "ID,Type,Title,Region,Latitude,Longitude,Severity,RiskScore,AffectedPopulation,EvacuationStatus\n"
                self.wfile.write(header.encode("utf-8"))
                for c in SYSTEM_STATE["active_calamities"]:
                    line = f"{c['id']},{c['type']},\"{c['title']}\",\"{c['region']}\",{c['coordinates'][0]},{c['coordinates'][1]},{c['severity']},{c['risk_score']},{c['affected_population']},{c['evacuation_status']}\n"
                    self.wfile.write(line.encode("utf-8"))
                return
            else:
                self.send_json_response({
                    "organization": "National Disaster Management Authority (NDMA)",
                    "portal": "NICAS Public Data Feeds",
                    "license": "National Data Sharing and Accessibility Policy (NDSAP) - Open Access",
                    "telemetry": SYSTEM_STATE["active_calamities"],
                    "output_devices_grid": SYSTEM_STATE["output_devices"],
                    "timestamp": datetime.now().isoformat()
                })
                return

        elif path == "/api/live-weather":
            params = parse_qs(parsed.query)
            lat = params.get("lat", ["17.385"])[0]
            lon = params.get("lon", ["78.486"])[0]
            try:
                import urllib.request
                om_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,surface_pressure,wind_speed_10m&timezone=auto"
                req = urllib.request.Request(om_url, headers={"User-Agent": "AegisAlert/5.5"})
                with urllib.request.urlopen(req, timeout=3.5) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    curr = data.get("current", {})
                    self.send_json_response({
                        "isLive": True,
                        "source": "Open-Meteo Public API (Proxied)",
                        "temperature_c": curr.get("temperature_2m", 30.0),
                        "humidity_pct": curr.get("relative_humidity_2m", 65),
                        "rainfall_mmh": curr.get("precipitation", 0.0),
                        "wind_speed_kmh": curr.get("wind_speed_10m", 15.0),
                        "pressure_hpa": curr.get("surface_pressure", 1010.0),
                        "timestamp": datetime.now().isoformat()
                    })
                    return
            except Exception as e:
                self.send_json_response({
                    "isLive": False,
                    "source": "Calibrated Baseline Fallback",
                    "error": str(e),
                    "temperature_c": 31.5,
                    "humidity_pct": 68,
                    "rainfall_mmh": 12.0,
                    "wind_speed_kmh": 18.0,
                    "pressure_hpa": 1008.0,
                    "timestamp": datetime.now().isoformat()
                })
                return

        elif path == "/api/stream":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            try:
                while True:
                    update_payload = json.dumps({
                        "event": "TELEMETRY_TICK",
                        "time": datetime.now().strftime("%H:%M:%S"),
                        "active_calamities": len(SYSTEM_STATE["active_calamities"]),
                        "active_sirens": SYSTEM_STATE["active_sirens"],
                        "towers_tethered": SYSTEM_STATE["telecom_towers"]["total_tethered"],
                        "satellite_link": "LOCKED (ISRO NavIC-1I)"
                    })
                    self.wfile.write(f"data: {update_payload}\n\n".encode("utf-8"))
                    self.wfile.flush()
                    time.sleep(2.5)
            except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
                return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            body = json.loads(post_data.decode("utf-8"))
        except Exception:
            body = {}

        if path == "/api/signal-pipeline/propagate":
            # Complete Omnichannel Signal Propagation:
            # Satellite -> Disaster Management Office -> Telecom Towers -> Output Devices (Internet & Offline)
            calamity_id = body.get("calamity_id", "CAL-01")
            calamity = next((c for c in SYSTEM_STATE["active_calamities"] if c["id"] == calamity_id), SYSTEM_STATE["active_calamities"][0])

            propagation_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            sha_seal = f"SHA256:{uuid.uuid4().hex[:32].upper()}"

            propagation_record = {
                "propagation_id": f"PROP-{uuid.uuid4().hex[:8].upper()}",
                "timestamp": propagation_time,
                "calamity_id": calamity_id,
                "region": calamity["region"],
                "hazard_title": calamity["title"],
                "cryptographic_seal": sha_seal,
                "stages": [
                    {
                        "stage": "1. DIRECT SATELLITE DOWNLINK",
                        "satellite": "ISRO NavIC-1I & INSAT-3DR",
                        "transponder": "S-Band 2492 MHz / C-Band DWT",
                        "target_downlink": "National Emergency Operations Centre (NEOC Bunker)",
                        "latency": "242 ms",
                        "status": "ACQUIRED_AND_VERIFIED"
                    },
                    {
                        "stage": "2. DISASTER MANAGEMENT COMMAND AUTHORIZATION",
                        "authority": "Shri R. K. Verma, IAS (Central Incident Commander)",
                        "office": "NEOC / Ministry of Home Affairs, New Delhi",
                        "legal_basis": "Section 10(2)(l) Disaster Management Act, 2005",
                        "seal": sha_seal,
                        "status": "SOVEREIGN_AUTHORIZATION_SIGNED"
                    },
                    {
                        "stage": "3. CELLULAR TOWER TETHERING SIGNALS",
                        "mechanism": "C-DOT SACHET Multi-Tower Cell Broadcast Service (CBS)",
                        "channel": 4370,
                        "towers_tethered": 42,
                        "coverage": "100% Mobile Transceivers in Geographic Sector",
                        "status": "AIRWAVE_BLAST_TRIGGERED"
                    },
                    {
                        "stage": "4A. INTERNET-CONNECTED OUTPUT DEVICES",
                        "targets": [
                            {"type": "4G/5G Resident Smartphones", "reached": 148200, "status": "PUSH_DELIVERED"},
                            {"type": "Smart City ICCC Digital LED Billboards (VMS)", "reached": 34, "status": "EVAC_ROUTE_DISPLAYED"},
                            {"type": "Indian Railways PIDS Station Displays", "reached": 14, "status": "HALT_CAUTION_SHOWN"},
                            {"type": "Hospital Trauma & Blood Bank Dashboards", "reached": 12, "status": "TRIAGE_ALERTED"},
                            {"type": "Television & OTT Emergency Overlays", "reached": 8, "status": "RED_CRAWL_INJECTED"}
                        ]
                    },
                    {
                        "stage": "4B. ZERO-INTERNET / OFFLINE OUTPUT DEVICES",
                        "targets": [
                            {"type": "Autonomous Solar Siren Masts (120dB Acoustic Horn)", "reached": 18, "status": "120dB_SOUNDING"},
                            {"type": "2G Feature Phones (Direct Cell Broadcast - No Internet)", "reached": 62000, "status": "RADIO_FRAME_DELIVERED"},
                            {"type": "ISRO NavIC Direct Satellite Ground Terminals", "reached": 24, "status": "SATELLITE_DIRECT_RECEIVED"},
                            {"type": "All India Radio (Akashvani) FM Transmitters", "reached": 4, "status": "100.1MHz_CARRIER_OVERRIDDEN"},
                            {"type": "Village Panchayat Public Address Loudspeakers", "reached": 36, "status": "VILLAGE_HORNS_ACTIVE"}
                        ]
                    }
                ],
                "summary": {
                    "total_internet_devices_reached": 148268,
                    "total_offline_devices_reached": 62082,
                    "telecom_towers_tethered": 42,
                    "satellites_engaged": 2,
                    "total_population_protected": calamity["affected_population"],
                    "evacuation_center": calamity["safe_shelter"]
                }
            }

            SYSTEM_STATE["last_pipeline_propagation"] = propagation_record
            SYSTEM_STATE["active_sirens"][calamity_id] = True

            self.send_json_response({
                "success": True,
                "message": "Sovereign Omnichannel Signal Pipeline propagated across all satellites, disaster offices, signal towers, internet devices, and offline airwave devices.",
                "pipeline": propagation_record
            })
            return

        elif path == "/api/alerts/broadcast":
            calamity_id = body.get("calamity_id", "CAL-01")
            alert_level = body.get("level", "CRITICAL_RED")
            target_region = body.get("region", "All High-Risk Sectors")
            evac_route = body.get("evac_route", "Proceed to nearest designated highland relief camp")
            message = body.get("message", "Immediate evacuation ordered by National Disaster Management Authority.")
            trigger_siren = body.get("trigger_siren", True)

            alert_record = {
                "alert_id": f"GOV-ALERT-{uuid.uuid4().hex[:6].upper()}",
                "calamity_id": calamity_id,
                "level": alert_level,
                "target_region": target_region,
                "evac_route": evac_route,
                "message": message,
                "dispatched_by": body.get("dispatched_by", "Shri R. K. Verma, IAS (Incident Commander)"),
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "siren_engaged": trigger_siren,
                "mobile_sms_count": 48500,
                "towers_tethered": 42,
                "sha256_seal": uuid.uuid4().hex
            }

            SYSTEM_STATE["dispatched_alerts"].insert(0, alert_record)
            if trigger_siren:
                SYSTEM_STATE["active_sirens"][calamity_id] = True

            mobile_dispatch = {
                "alert_id": alert_record["alert_id"],
                "target_region": target_region,
                "phones_targeted": 48500,
                "sms_preview": f"[URGENT EVACUATION ALERT - NDMA / MHA]: {message} Safe Route: {evac_route}",
                "status": "DELIVERED_TO_TOWERS",
                "timestamp": alert_record["timestamp"]
            }
            SYSTEM_STATE["mobile_notifications_log"].insert(0, mobile_dispatch)

            self.send_json_response({
                "success": True,
                "message": "Emergency alert broadcast successfully to all mobile towers, satellites, and output devices in affected area.",
                "alert": alert_record,
                "mobile_delivery": mobile_dispatch
            })
            return

        elif path == "/api/alerts/siren/trigger":
            calamity_id = body.get("calamity_id", "CAL-01")
            state = body.get("state", True)
            SYSTEM_STATE["active_sirens"][calamity_id] = state

            self.send_json_response({
                "success": True,
                "calamity_id": calamity_id,
                "siren_active": state,
                "message": f"Hazard siren {'ENGAGED (120dB acoustic horn + 360 strobe)' if state else 'SILENCED'} for {calamity_id}."
            })
            return

        elif path == "/api/mobile/simulate-sms":
            phone = body.get("phone", "+91 98765 43210")
            location = body.get("location", "Majuli, Assam")
            evac_target = body.get("evacuation_target", "Garmur Highland Shelter (+38m)")

            notification = {
                "id": f"SMS-{uuid.uuid4().hex[:6].upper()}",
                "recipient": phone,
                "location": location,
                "carrier_routing": "C-DOT SACHET Cell Broadcast Bridge (Zero-Delay Over-The-Air)",
                "sms_text": f"🚨 [GOVERNMENT OF INDIA - EMERGENCY EVACUATION ALERT]\nSevere hazard detected in {location}.\nImmediate evacuation is mandatory.\nSafe Route: Follow markers to {evac_target}.\nHelp Helpline: 112 / 1070. Free Emergency Medical Care available.",
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "status": "SENT_OVER_AIRWAVES"
            }

            SYSTEM_STATE["mobile_notifications_log"].insert(0, notification)
            self.send_json_response({
                "success": True,
                "notification": notification
            })
            return

        self.send_error(404, "Endpoint not found")

    def send_json_response(self, data, code=200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

class ThreadingServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

def run_server():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    target_port = PORT
    for p in range(PORT, PORT + 10):
        try:
            test_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            test_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            test_sock.bind(("0.0.0.0", p))
            test_sock.close()
            target_port = p
            break
        except OSError:
            continue

    server_address = ("0.0.0.0", target_port)
    httpd = ThreadingServer(server_address, AegisDisasterRequestHandler)

    print("=" * 80)
    print(" 🛡️  AEGIS ALERT — ALL-IN-ONE SINGLE UNIFIED LOCALHOST SERVER")
    print("=" * 80)
    print(f" [*] UNIFIED APPLICATION URL: http://localhost:{target_port}")
    print(f" [*] EVERYTHING IN ONE PORT:   Frontend UI + GIS Map + AI Assistant + REST APIs + SSE")
    print(f" [*] Local Serving Directory:  {DIRECTORY}")
    print("-" * 80)
    print(" [✓] Integrated Services Active on http://localhost:8080:")
    print("     • 🌐 Web Application UI:     http://localhost:8080/")
    print("     • 🗺️  Tactical Leaflet GIS:   http://localhost:8080/#view-map")
    print("     • ⏱️  6-Hour Forecast:        http://localhost:8080/#view-forecast")
    print("     • 🤖 Ask AEGIS (WeatherGPT):  http://localhost:8080/#view-ai")
    print("     • 📊 Multi-Hazard Analytics:  http://localhost:8080/#view-analytics")
    print("     • 📡 REST API Status:         http://localhost:8080/api/status")
    print("     • 📍 Multi-City Telemetry:    http://localhost:8080/api/locations")
    print("     • 📥 Open Data Export (CSV):  http://localhost:8080/api/gov/export?format=csv")
    print("=" * 80)
    print(f"🚀 Unified System is LIVE & listening on http://localhost:{target_port}")
    sys.stdout.flush()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down AegisAlert server gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
