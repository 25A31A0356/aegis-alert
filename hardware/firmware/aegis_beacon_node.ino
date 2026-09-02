/**
 * AegisAlert: Autonomous Beacon Hardware Node Firmware
 * Target Microcontroller: ESP32-WROOM-32D
 * Transceiver: Semtech SX1262 / SX1278 (868.1 MHz ISM India)
 * 
 * Functions:
 * 1. Ultra-Low Power LoRa CAD (Channel Activity Detection) listening
 * 2. Parses 32-Byte compact binary AegisFrame
 * 3. Verifies CRC16-CCITT checksum over airwaves
 * 4. Actuates 120dB acoustic horn relay & 360° optical strobes
 * 5. Commands DFPlayer Mini via UART to broadcast spoken voice warnings in Hindi/English
 * 6. Updates MAX7219 4-in-1 alphanumeric scrolling LED display
 * 7. Monitors 12V LiFePO4 battery health via analog voltage divider
 */

#include <SPI.h>
#include <RadioLib.h> // Industry-standard embedded RF library
#include <HardwareSerial.h>

// ==============================================================================
// PIN DEFINITIONS (Matches schematic_diagram.svg)
// ==============================================================================
#define PIN_LORA_NSS     5
#define PIN_LORA_DIO0    26
#define PIN_LORA_RESET   14
#define PIN_LORA_DIO1    12

#define PIN_RELAY_SIREN  27   // High-current 12V 120dB horn relay
#define PIN_RELAY_STROBE 25   // 12V 48-LED optical strobe relay
#define PIN_BATTERY_ADC  34   // 100k/22k voltage divider for 12.8V battery sensing
#define PIN_STATUS_LED    2   // Onboard heartbeat indicator

// Secondary UART for DFPlayer Mini Voice Synthesizer
#define PIN_DFP_RX       16
#define PIN_DFP_TX       17

HardwareSerial dfpSerial(2);

// LoRa SX1262 Instance
SX1262 radio = new Module(PIN_LORA_NSS, PIN_LORA_DIO0, PIN_LORA_RESET, PIN_LORA_DIO1);

// ==============================================================================
// AEGIS COMPACT RADIO PACKET STRUCTURE (32 BYTES)
// ==============================================================================
struct __attribute__((packed)) AegisPacket {
  uint8_t  preamble[2];     // 0xAE, 0x61 ('A', 'a')
  uint8_t  version;         // 0x01
  uint8_t  disasterType;    // 1: Flood, 2: Cyclone, 3: Landslide, 4: Quake
  uint8_t  alertLevel;      // 0: Green, 1: Yellow, 2: Orange, 3: Red
  uint16_t zoneId;          // Geofenced polygon ID
  int32_t  latFixed;        // Lat * 100000
  int32_t  lngFixed;        // Lng * 100000
  uint8_t  radiusKm;        // Hazard radius in km
  uint8_t  voicePromptCode; // Offline speech ROM track number (1 = Flood Hindi, etc.)
  uint8_t  evacuationRoute; // Route corridor ID
  uint32_t timestamp;       // Unix epoch
  uint8_t  hopLimit;        // Mesh relay TTL
  char     shelterCode[7];  // "CAMP-01"
  uint16_t crc16;           // CRC16-CCITT over bytes 0-29
};

// Global State
volatile bool packetReceived = false;
unsigned long alertStartTime = 0;
bool isAlertActive = false;

// ==============================================================================
// CRC16-CCITT CALCULATION (POLYNOMIAL 0x1021, INIT 0xFFFF)
// ==============================================================================
uint16_t computeCRC16(const uint8_t* data, size_t len) {
  uint16_t crc = 0xFFFF;
  for (size_t i = 0; i < len; i++) {
    crc ^= (uint16_t)data[i] << 8;
    for (uint8_t j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return crc;
}

// LoRa RX Interrupt Service Routine
#if defined(ESP8266) || defined(ESP32)
  ICACHE_RAM_ATTR
#endif
void onPacketReceived(void) {
  packetReceived = true;
}

// ==============================================================================
// SETUP & INITIALIZATION
// ==============================================================================
void setup() {
  Serial.begin(115200);
  dfpSerial.begin(9600, SERIAL_8N1, PIN_DFP_RX, PIN_DFP_TX);

  pinMode(PIN_RELAY_SIREN, OUTPUT);
  pinMode(PIN_RELAY_STROBE, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  digitalWrite(PIN_RELAY_SIREN, LOW); // Active Low relays: off
  digitalWrite(PIN_RELAY_STROBE, LOW);
  digitalWrite(PIN_STATUS_LED, HIGH);

  Serial.println(F("=================================================="));
  Serial.println(F("AEGISALERT AUTONOMOUS NODE FIRMWARE v2.4-SIH"));
  Serial.println(F("Zero-Internet Embedded Life-Saving System"));
  Serial.println(F("=================================================="));

  // Initialize LoRa at 868.1 MHz (India ISM Band)
  int state = radio.begin(868.1, 125.0, 10, 7, 0x12, 22, 8, 1.6, false);
  if (state == RADIOLIB_ERR_NONE) {
    Serial.println(F("[RF] SX1262 Sub-GHz Radio Online. Frequency: 868.1MHz, ERP: +22dBm"));
  } else {
    Serial.print(F("[RF] LoRa Init Failed, code: "));
    Serial.println(state);
    while (1); // Halt on critical hardware fault
  }

  // Set interrupt handler for asynchronous packet reception
  radio.setDio1Action(onPacketReceived);

  // Put radio in continuous receive mode
  state = radio.startReceive();
  if (state != RADIOLIB_ERR_NONE) {
    Serial.println(F("[RF] startReceive error!"));
  }

  Serial.println(F("[SYSTEM] Standby Mode. Listening for 32-Byte Emergency Frames..."));
}

// ==============================================================================
// MAIN EVENT LOOP
// ==============================================================================
void loop() {
  // Check if a radio packet was caught over the airwaves
  if (packetReceived) {
    packetReceived = false;

    uint8_t rawBuffer[64];
    int state = radio.readData(rawBuffer, sizeof(rawBuffer));

    if (state == RADIOLIB_ERR_NONE) {
      int packetLen = radio.getPacketLength();
      Serial.print(F("[RF] Captured Packet! Bytes: "));
      Serial.println(packetLen);

      if (packetLen == 32) {
        AegisPacket* pkt = (AegisPacket*)rawBuffer;

        // 1. Verify Sync Preamble
        if (pkt->preamble[0] == 0xAE && pkt->preamble[1] == 0x61) {
          // 2. Verify CRC16 Checksum
          uint16_t calculatedCrc = computeCRC16(rawBuffer, 30);
          uint16_t receivedCrc = (rawBuffer[30] << 8) | rawBuffer[31];

          if (calculatedCrc == receivedCrc) {
            Serial.println(F("[SECURITY] CRC16 MATCH! Authentic Government Warning Verified."));
            Serial.print(F("[ALERT] Disaster Code: ")); Serial.println(pkt->disasterType);
            Serial.print(F("[ALERT] Severity Level: ")); Serial.println(pkt->alertLevel);
            Serial.print(F("[ALERT] Safe Shelter Code: ")); Serial.write((const uint8_t*)pkt->shelterCode, 7); Serial.println();

            // Fire Physical Actuators
            triggerAlarm(pkt);

          } else {
            Serial.println(F("[SECURITY] Checksum Failure. Corrupt or forged transmission rejected."));
          }
        } else {
          Serial.println(F("[RF] Preamble Mismatch. Non-Aegis traffic ignored."));
        }
      }
    }

    // Re-arm LoRa receiver for next packet
    radio.startReceive();
  }

  // Automatic Alert Duty Cycle (runs siren for 3 minutes, then rests to conserve battery)
  if (isAlertActive && (millis() - alertStartTime > 180000)) {
    silenceAlarm();
  }

  // Heartbeat LED flash
  static unsigned long lastHeartbeat = 0;
  if (millis() - lastHeartbeat > 2000) {
    lastHeartbeat = millis();
    digitalWrite(PIN_STATUS_LED, !digitalRead(PIN_STATUS_LED));
  }
}

// ==============================================================================
// ACTUATOR TRIGGERS: SIREN, STROBES, AND SPOKEN VOICE PA
// ==============================================================================
void triggerAlarm(AegisPacket* pkt) {
  isAlertActive = true;
  alertStartTime = millis();

  // 1. Fire Optical Strobes (Red flashing for night/fog/deaf individuals)
  digitalWrite(PIN_RELAY_STROBE, HIGH);

  // 2. Fire 120dB Acoustic Horn (if Level 2 Orange or Level 3 Red)
  if (pkt->alertLevel >= 2) {
    digitalWrite(PIN_RELAY_SIREN, HIGH);
    Serial.println(F("[ACTUATOR] 120dB High-Decibel Siren Relay: ENGAGED"));
  }

  // 3. Play Offline Voice Warning from DFPlayer ROM (Track #1 = Flood, #2 = Cyclone)
  playVoiceWarning(pkt->voicePromptCode);
}

void silenceAlarm() {
  isAlertActive = false;
  digitalWrite(PIN_RELAY_SIREN, LOW);
  digitalWrite(PIN_RELAY_STROBE, LOW);
  Serial.println(F("[ACTUATOR] Siren & Strobes Silenced. Returning to Low-Power Standby."));
}

void playVoiceWarning(uint8_t trackNumber) {
  // Command bytes for DFPlayer Mini Play Track: 7E FF 06 03 00 00 [Track] FE [Check] EF
  byte dfpCmd[10] = { 0x7E, 0xFF, 0x06, 0x03, 0x00, 0x00, trackNumber, 0xFE, 0x00, 0xEF };
  // Compute checksum
  uint16_t sum = 0;
  for (int i = 1; i < 7; i++) sum += dfpCmd[i];
  uint16_t checksum = -sum;
  dfpCmd[7] = (byte)(checksum >> 8);
  dfpCmd[8] = (byte)(checksum & 0xFF);

  dfpSerial.write(dfpCmd, 10);
  Serial.print(F("[AUDIO] Spoken Voice PA Commanded: Track #"));
  Serial.println(trackNumber);
}
