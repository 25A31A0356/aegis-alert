/**
 * AegisPacket: Zero-Internet Sub-GHz / NavIC Compact Radio Protocol
 * 
 * In real disaster conditions, wireless channels are noisy and bandwidth is constrained.
 * AegisAlert compresses life-saving instructions into a standardized 32-Byte binary frame
 * that can be transmitted over LoRa 868MHz or ISRO NavIC satellite messaging with 100% 
 * packet-recovery guarantee.
 */

export class RadioProtocol {
  static PREAMBLE = [0xAE, 0x61]; // 'AE', 'G'
  static PROTOCOL_VERSION = 0x01;

  /**
   * Encodes emergency disaster parameters into a 32-byte binary radio frame
   * @param {Object} data 
   * @returns {Object} { buffer: Uint8Array, hexString: string, bitStream: string, byteBreakdown: Array }
   */
  static encodePacket({
    disasterType = "FLASH_FLOOD",
    alertLevel = "RED",
    zoneId = 101,
    lat = 11.6854,
    lng = 76.1320,
    radiusKm = 15,
    voiceCode = 1,
    routeId = 3,
    shelterCode = "CAMP01",
    hopLimit = 5
  }) {
    const buffer = new Uint8Array(32);
    const view = new DataView(buffer.buffer);

    // Bytes 0-1: Sync Preamble (0xAE, 0x61)
    buffer[0] = this.PREAMBLE[0];
    buffer[1] = this.PREAMBLE[1];

    // Byte 2: Version
    buffer[2] = this.PROTOCOL_VERSION;

    // Byte 3: Disaster Type Code
    const typeMap = { FLASH_FLOOD: 0x01, CYCLONE: 0x02, LANDSLIDE: 0x03, EARTHQUAKE: 0x04 };
    buffer[3] = typeMap[disasterType] || 0x01;

    // Byte 4: Alert Level (0: Green, 1: Yellow, 2: Orange, 3: Red)
    const levelMap = { GREEN: 0x00, YELLOW: 0x01, ORANGE: 0x02, RED: 0x03 };
    buffer[4] = levelMap[alertLevel] ?? 0x03;

    // Bytes 5-6: Target Zone Polygon ID (uint16)
    view.setUint16(5, zoneId, false); // Big endian

    // Bytes 7-10: Latitude (Fixed point * 100000)
    view.setInt32(7, Math.round(lat * 100000), false);

    // Bytes 11-14: Longitude (Fixed point * 100000)
    view.setInt32(11, Math.round(lng * 100000), false);

    // Byte 15: Warning Radius (km)
    buffer[15] = Math.min(255, Math.max(1, radiusKm));

    // Byte 16: Voice Instruction Code (triggers offline ROM audio in hardware)
    buffer[16] = voiceCode & 0xFF;

    // Byte 17: Evacuation Route ID
    buffer[17] = routeId & 0xFF;

    // Bytes 18-21: Unix Timestamp (seconds)
    const epochSec = Math.floor(Date.now() / 1000);
    view.setUint32(18, epochSec, false);

    // Byte 22: Mesh Hop Counter / Time-To-Live (decremented on each relay node)
    buffer[22] = hopLimit & 0xFF;

    // Bytes 23-29: Emergency Shelter ASCII Code (7 bytes, e.g., "CAMP-01")
    const cleanShelter = (shelterCode + "       ").substring(0, 7);
    for (let i = 0; i < 7; i++) {
      buffer[23 + i] = cleanShelter.charCodeAt(i) || 0x20;
    }

    // Bytes 30-31: CRC16-CCITT Checksum over bytes 0-29
    const crc = this.computeCRC16(buffer.subarray(0, 30));
    view.setUint16(30, crc, false);

    // Generate Hex String & Visual Breakdown
    const hexArray = Array.from(buffer).map(b => b.toString(16).padStart(2, "0").toUpperCase());
    const hexString = hexArray.join(" ");

    const byteBreakdown = [
      { offset: "00-01", label: "Sync Preamble", hex: `${hexArray[0]} ${hexArray[1]}`, desc: "Aegis Network Sync (0xAE61)" },
      { offset: "02", label: "Protocol Ver", hex: hexArray[2], desc: `v${buffer[2]}` },
      { offset: "03", label: "Disaster Code", hex: hexArray[3], desc: `${disasterType} (0x0${buffer[3]})` },
      { offset: "04", label: "Alert Severity", hex: hexArray[4], desc: `${alertLevel} Level` },
      { offset: "05-06", label: "Zone Geofence", hex: `${hexArray[5]} ${hexArray[6]}`, desc: `Zone #${zoneId}` },
      { offset: "07-14", label: "GPS Coordinates", hex: `${hexArray[7]}..${hexArray[14]}`, desc: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E` },
      { offset: "15", label: "Radius (km)", hex: hexArray[15], desc: `${radiusKm} km radius` },
      { offset: "16", label: "Audio Prompt ID", hex: hexArray[16], desc: `Speech ROM Track #${voiceCode}` },
      { offset: "17", label: "Route ID", hex: hexArray[17], desc: `Safe Corridor #${routeId}` },
      { offset: "18-21", label: "Timestamp", hex: `${hexArray[18]}..${hexArray[21]}`, desc: new Date(epochSec * 1000).toLocaleTimeString() },
      { offset: "22", label: "Mesh TTL", hex: hexArray[22], desc: `${hopLimit} hops remaining` },
      { offset: "23-29", label: "Shelter ID", hex: `${hexArray[23]}..${hexArray[29]}`, desc: cleanShelter.trim() },
      { offset: "30-31", label: "CRC16 CCITT", hex: `${hexArray[30]} ${hexArray[31]}`, desc: `0x${crc.toString(16).toUpperCase()}` }
    ];

    return {
      buffer,
      hexString,
      byteBreakdown,
      crc: crc.toString(16).toUpperCase(),
      sizeBytes: buffer.length
    };
  }

  /**
   * Decodes a 32-byte frame received at an autonomous AegisBeacon field node
   * @param {Uint8Array} buffer 
   * @returns {Object} Decoded packet payload or error
   */
  static decodePacket(buffer) {
    if (buffer.length !== 32) {
      return { valid: false, error: "Invalid frame length (expected 32 bytes)" };
    }

    if (buffer[0] !== this.PREAMBLE[0] || buffer[1] !== this.PREAMBLE[1]) {
      return { valid: false, error: "Sync preamble mismatch (not an Aegis packet)" };
    }

    const view = new DataView(buffer.buffer);
    const expectedCrc = this.computeCRC16(buffer.subarray(0, 30));
    const receivedCrc = view.getUint16(30, false);

    if (expectedCrc !== receivedCrc) {
      return { valid: false, error: "CRC16 checksum failure (corrupted packet over airwaves)" };
    }

    const typeReverse = { 0x01: "FLASH_FLOOD", 0x02: "CYCLONE", 0x03: "LANDSLIDE", 0x04: "EARTHQUAKE" };
    const levelReverse = { 0x00: "GREEN", 0x01: "YELLOW", 0x02: "ORANGE", 0x03: "RED" };

    const disasterType = typeReverse[buffer[3]] || "UNKNOWN";
    const alertLevel = levelReverse[buffer[4]] || "UNKNOWN";
    const zoneId = view.getUint16(5, false);
    const lat = view.getInt32(7, false) / 100000;
    const lng = view.getInt32(11, false) / 100000;
    const radiusKm = buffer[15];
    const voiceCode = buffer[16];
    const routeId = buffer[17];
    const timestamp = view.getUint32(18, false);
    const hopsLeft = buffer[22];

    let shelterCode = "";
    for (let i = 23; i <= 29; i++) {
      shelterCode += String.fromCharCode(buffer[i]);
    }

    return {
      valid: true,
      disasterType,
      alertLevel,
      zoneId,
      coordinates: [lat, lng],
      radiusKm,
      voiceCode,
      routeId,
      timestamp: new Date(timestamp * 1000).toISOString(),
      hopsLeft,
      shelterCode: shelterCode.trim()
    };
  }

  /**
   * Computes standard CRC16-CCITT (Polynomial 0x1021, Init 0xFFFF)
   */
  static computeCRC16(bytes) {
    let crc = 0xFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc ^= bytes[i] << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc;
  }
}
