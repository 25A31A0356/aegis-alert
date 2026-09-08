import { ChatMessage, ChatSource } from '@shared';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  response: string;
  directives: string[];
  actionRecommendations: string[];
}

export const DISASTER_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. FLOODS
  {
    id: 'kb_flood_general',
    title: 'Flood Emergency Protocols & Rising Water Safety',
    category: 'Flood',
    keywords: [
      'flood',
      'flooding',
      'rising water',
      'water level',
      'submerged',
      'drown',
      'inundation',
      'overflow',
      'river breach',
      'dam',
    ],
    response: `🌊 FLOOD EMERGENCY PROTOCOL (NDMA Guidelines):

1. IMMEDIATE HIGH-GROUND RELOCATION:
   • Move immediately to the highest floor or a designated reinforced high-ground shelter.
   • Do not take refuge in closed attics unless there is an unobstructed roof exit.

2. POWER & GAS ISOLATION:
   • Switch off the main electrical breaker board and disconnect LPG cylinder regulator valves.
   • Never touch electrical switches, cords, or appliances while standing in water.

3. 15CM / 30CM WATER DANGER RULE:
   • NEVER walk through moving floodwater (just 15 cm of fast-moving water can knock an adult down).
   • NEVER drive into flooded streets (30 cm of moving water can float small cars; 60 cm will sweep away SUVs).

4. WATER & FOOD SANITATION:
   • Boil all drinking water vigorously for at least 1 minute or use chlorine water-purification tablets.
   • Discard all unsealed food items that have come in contact with floodwater.

5. COMMUNICATION:
   • Keep phone battery on extreme power-saving mode. Monitor official CWC/SDMA broadcast channels.`,
    directives: [
      'Disconnect electrical mains and LPG cylinders.',
      'Relocate family and essential medicines to upper floors or high-ground shelters.',
      'Do not walk or drive through standing/moving water.',
    ],
    actionRecommendations: [
      'Find High-Ground Shelters',
      'Broadcast "I Am Safe" Status',
      'Open 72h Survival Checklist',
      'Call Emergency 112',
    ],
  },

  // 2. CYCLONES
  {
    id: 'kb_cyclone_general',
    title: 'Severe Cyclone Landfall & High-Wind Protection',
    category: 'Cyclone',
    keywords: [
      'cyclone',
      'storm',
      'hurricane',
      'typhoon',
      'gale',
      'high winds',
      'landfall',
      'storm surge',
      'squall',
    ],
    response: `🌀 SEVERE CYCLONE SAFETY PROTOCOL (IMD / NDMA Guidelines):

1. INDOOR FORTIFICATION:
   • Stay strictly indoors inside the innermost concrete room, hallway, or designated cyclone shelter.
   • Keep windows and external doors firmly bolted. Stay away from glass panes.

2. AVOID THE "EYE OF THE CYCLONE" TRAP:
   • If winds suddenly drop to dead calm, DO NOT venture outside. This is the eye of the storm.
   • Violent gale winds will resume abruptly from the opposite direction within minutes.

3. SURGE EVACUATION:
   • If located within 5 km of the coastline or in low-lying tidal inlets, evacuate immediately along pre-identified high-ground ridge corridors.

4. FLYING DEBRIS PRECAUTION:
   • If your roof begins to tear or walls crack, seek immediate cover under heavy solid furniture, wooden cots, or thick mattresses.`,
    directives: [
      'Stay in reinforced internal rooms away from glass windows.',
      'Do not leave shelter during the eye-of-storm calm lull.',
      'Evacuate tidal coastal reaches immediately.',
    ],
    actionRecommendations: [
      'Find Nearest Cyclone Shelter',
      'View Evacuation Corridors',
      'NDMA Cyclone Protocol',
    ],
  },

  // 3. EARTHQUAKES
  {
    id: 'kb_earthquake_general',
    title: 'Earthquake Shaking, Drop-Cover-Hold & Aftershocks',
    category: 'Earthquake',
    keywords: [
      'earthquake',
      'quake',
      'tremor',
      'shaking',
      'aftershock',
      'seismic',
      'drop cover hold',
      'building shaking',
      'richter',
    ],
    response: `🏚️ EARTHQUAKE SURVIVAL PROTOCOL:

1. INDOORS: DROP, COVER, AND HOLD ON:
   • DROP down onto your hands and knees.
   • COVER your head and neck underneath a sturdy table, desk, or reinforced structural corner.
   • HOLD ON to your shelter until all shaking ceases.
   • Stay away from exterior glass, chandeliers, unsecured tall bookcases, and masonry facades.

2. STAIRS & ELEVATORS:
   • NEVER use elevators during or after a tremor.
   • Do not rush into crowded stairwells during active shaking; wait until tremors stop, then evacuate in an orderly manner.

3. OUTDOORS:
   • Move quickly to an open clearing away from buildings, overhead electrical transmission lines, billboards, and bridges.

4. POST-SHOCK INSPECTION:
   • Smell for gas leaks. If detected, do not flip electrical switches (sparks ignite gas). Open windows and evacuate immediately.`,
    directives: [
      'Drop, Cover, and Hold On under heavy furniture.',
      'Do not use elevators under any circumstances.',
      'Check for gas leaks and structural wall fissures before re-entry.',
    ],
    actionRecommendations: [
      'Report Structural Hazard',
      'Send "I Am Safe" Ping',
      'View Earthquake Guide',
    ],
  },

  // 4. LIGHTNING & THUNDERSTORMS
  {
    id: 'kb_lightning_general',
    title: 'Severe Lightning Storms & The 30-30 Safety Rule',
    category: 'Lightning',
    keywords: [
      'lightning',
      'thunder',
      'thunderstorm',
      'struck by lightning',
      'electric shock',
      '30-30 rule',
      'open field lightning',
    ],
    response: `⚡ LIGHTNING & THUNDERSTORM PROTOCOL (NDMA Guidelines):

1. THE 30-30 RULE:
   • If the time between seeing lightning and hearing thunder is less than 30 seconds, you are in immediate strike danger. Seek indoor shelter immediately.
   • Stay indoors for at least 30 minutes after the last thunder rumble.

2. INDOOR SAFE PRACTICES:
   • Avoid contact with corded landlines, electrical appliances, and indoor plumbing (taps, sinks, showers).
   • Unplug sensitive electronics to prevent power-surge hazards.

3. OUTDOOR EMERGENCY ACTION (NO SHELTER AVAILABLE):
   • NEVER seek shelter under tall, isolated trees or metal structures.
   • Enclosed metal-topped motor vehicles provide safe Faraday cage protection (keep windows rolled up).
   • If caught in an open field with no vehicle: Crouch low on the balls of your feet with heels touching, head tucked down, and hands over ears. Minimize contact with the ground.`,
    directives: [
      'Seek shelter in substantial buildings or hard-top vehicles.',
      'Stay away from isolated tall trees, water bodies, and metal fences.',
      'Follow the 30-30 Rule before returning outdoors.',
    ],
    actionRecommendations: [
      'View Lightning Safety Guide',
      'Report Fallen Power Line',
    ],
  },

  // 5. LANDSLIDES & DEBRIS FLOW
  {
    id: 'kb_landslide_general',
    title: 'Landslide Early Warning & Hill Slope Evacuation',
    category: 'Landslide',
    keywords: [
      'landslide',
      'mudslide',
      'rockfall',
      'debris flow',
      'hill slope',
      'mountain collapse',
      'cracking ground',
    ],
    response: `⛰️ LANDSLIDE & DEBRIS FLOW PROTOCOL:

1. EARLY WARNING SIGNS:
   • Watch for new cracks appearing in plaster, tile, brick, or foundations.
   • Notice doors or windows sticking or jamming for the first time.
   • Look out for tilting telephone poles, trees, or retaining walls.
   • A sudden faint rumbling sound that increases in volume or sudden muddying of clear stream water.

2. RAPID ACTION DURING ACTIVE SLIDE:
   • Move quickly out of the direct path of the landslide or debris flow.
   • Move laterally across the slope towards stable bedrock or designated ridge safety points.

3. AVOID RIVER VALLEYS & GULLIES:
   • Do not shelter in low drainage channels, culverts, or stream beds where mudflow velocity peaks.`,
    directives: [
      'Evacuate immediately if cracking sounds or sudden muddying of streams occurs.',
      'Move laterally away from gullies and drainage paths.',
      'Stay alert on saturated mountain highways.',
    ],
    actionRecommendations: [
      'View High-Ground Elevation Map',
      'Report Blocked Hill Route',
    ],
  },

  // 6. HEAT EMERGENCIES & HEATWAVE
  {
    id: 'kb_heat_general',
    title: 'Extreme Heatwave & Heat Stroke First-Aid',
    category: 'Heatwave',
    keywords: [
      'heat',
      'heatwave',
      'heat stroke',
      'heat exhaustion',
      'dehydration',
      'sun stroke',
      'high temperature',
      'fever heat',
    ],
    response: `☀️ EXTREME HEATWAVE & HEAT STROKE EMERGENCY:

1. HEAT STROKE VS HEAT EXHAUSTION:
   • Heat Exhaustion: Heavy sweating, pale skin, dizziness, muscle cramps, nausea.
   • Heat Stroke (LIFE-THREATENING): High body temp (>104°F / 40°C), hot/red dry skin, rapid pulse, confusion, unconsciousness.

2. EMERGENCY HEAT STROKE FIRST-AID:
   • Call emergency medical assistance (108 / 112) immediately.
   • Move patient immediately to a cool, shaded, or air-conditioned area.
   • Cool the body rapidly: Apply cool wet towels, ice packs to neck, armpits, and groin, or gently fan the skin while misting with cold water.
   • If conscious and alert, give sips of cool water or Oral Rehydration Salts (ORS). Do NOT give liquids if unconscious.

3. PREVENTATIVE PROTOCOLS:
   • Drink at least 3-4 liters of water daily even if not thirsty.
   • Avoid direct sun exposure between 12:00 PM and 4:00 PM. Wear loose light-colored cotton clothing.`,
    directives: [
      'Move heat stroke patients to cool shade and apply cold water packs to groin/armpits.',
      'Administer Oral Rehydration Salts (ORS) and lemon water.',
      'Avoid outdoor exertion between 12:00 PM and 4:00 PM.',
    ],
    actionRecommendations: [
      'Dial Ambulance (108)',
      'View Medical First Aid Guide',
    ],
  },

  // 7. EVACUATION & 72-HOUR SURVIVAL KIT
  {
    id: 'kb_evacuation_kit',
    title: 'Evacuation Protocol & 72-Hour Survival Kit Essentials',
    category: 'Evacuation',
    keywords: [
      'evacuation',
      'carry',
      'pack',
      'kit',
      'survival kit',
      'checklist',
      'supplies',
      'what to take',
      'what should i carry',
      'bag',
      'grab and go',
      '72 hour',
    ],
    response: `🎒 72-HOUR DISASTER SURVIVAL "GO-BAG" CHECKLIST:

1. WATER & HYDRATION (PRIORITY #1):
   • 3 Liters of sealed drinking water per person per day (minimum 3-day supply = 9L per person).
   • Water purification chlorine tablets or portable filtration straw.

2. NON-PERISHABLE NUTRITION:
   • High-calorie energy bars, dry fruits, roasted gram, glucose biscuits, and canned food with manual can opener.

3. MEDICAL & FIRST AID:
   • Fully stocked first-aid kit (antiseptic, bandages, gauze, burn ointment, ORS sachets).
   • 14-day supply of essential daily prescription medications (insulin, BP, heart medicines).

4. VITAL DOCUMENTS (WATERPROOF ZIP POUCH):
   • Aadhaar card, voter ID, passport, property deeds, bank passbooks, medical records, insurance policies, and emergency cash in small denominations.

5. TACTICAL TOOLS & ILLUMINATION:
   • High-lumen LED torch & spare AA/AAA batteries.
   • Hand-crank or battery AM/FM emergency radio.
   • High-capacity charged 20,000mAh power bank and charging cables.
   • Emergency loud rescue whistle & multi-tool knife.

6. PERSONAL HYGIENE & SANITATION:
   • N95 dust/smoke masks, soap, alcohol hand sanitizer, sanitary pads, wet wipes, and heavy-duty garbage bags.`,
    directives: [
      'Pack 3 liters of water per person per day and non-perishable rations.',
      'Store IDs, property records, and emergency cash in waterproof pouches.',
      'Include essential daily prescription medicines and power banks.',
    ],
    actionRecommendations: [
      'Interactive 72h Survival Checklist',
      'Find Verified Shelters',
      'Download Offline Resource Pack',
    ],
  },

  // 8. EMERGENCY COMMUNICATIONS & SIGNALS
  {
    id: 'kb_comm_sos',
    title: 'Emergency Distress Signaling & Low-Power Communication',
    category: 'Communication',
    keywords: [
      'signal',
      'sos',
      'distress',
      'whistle',
      'communication',
      'low battery',
      'sms',
      'no signal',
      'trapped',
      'rescue',
    ],
    response: `📡 EMERGENCY DISTRESS SIGNALING & RESCUE PROTOCOL:

1. UNIVERSAL AUDIO DISTRESS SIGNAL:
   • Blow 3 short blasts on an emergency whistle, pause for 5 seconds, repeat.
   • Three of anything is the internationally recognized distress code.

2. LOW-BANDWIDTH SMS OVER CELLULAR:
   • In congested or weak 2G signal areas, phone calls fail while text SMS packets often go through.
   • Send compact SMS: "SOS [NAME] [LOCATION / LANDMARK] [PEOPLE TRAPPED] [MEDICAL EMERGENCY Y/N]".

3. VISUAL SIGNALS FOR DRONES / HELICOPTERS:
   • Wave brightly colored cloth (red/orange) or flash mirrors/torches in a 3-flash cadence.
   • Spell out "SOS" or "HELP" on roofs using chalk, stones, or reflective materials.

4. BATTERY CONSERVATION:
   • Turn screen brightness to lowest setting.
   • Disable Bluetooth, GPS auto-polling, and background app refresh. Use text messaging only.`,
    directives: [
      'Use 3 sharp whistle blasts to signal rescue teams.',
      'Send compact emergency SMS if voice calls fail on 2G.',
      'Conserve phone battery for vital rescue coordination.',
    ],
    actionRecommendations: [
      'Activate SOS Distress Beacon',
      'Send "I Am Safe" Check-In',
      'Call Emergency 112',
    ],
  },
];

/**
 * Local Rule-Based & Semantic Token Matcher
 * Executes 100% locally in the browser with zero external dependencies.
 */
export function queryLocalKnowledgeBase(queryText: string): {
  response: string;
  category?: string;
  directives: string[];
  actionRecommendations: string[];
  confidence: number;
} {
  const clean = queryText.toLowerCase().trim();

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of DISASTER_KNOWLEDGE_BASE) {
    let score = 0;

    for (const keyword of item.keywords) {
      if (clean.includes(keyword)) {
        // Boost score for multi-word or exact matches
        score += keyword.includes(' ') ? 4 : 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 2) {
    return {
      response: bestMatch.response,
      category: bestMatch.category,
      directives: bestMatch.directives,
      actionRecommendations: bestMatch.actionRecommendations,
      confidence: Math.min(100, highestScore * 20),
    };
  }

  // Fallback if no specific keyword matched
  return {
    response: `🛡️ AEGIS DISASTER AI (OFFLINE KNOWLEDGE BASE):

I am currently running in Autonomous Local Mode with verified National Disaster Management Authority (NDMA) protocols.

I can immediately guide you on:
• 🌊 Flood Survival & High-Ground Relocation
• 🌀 Cyclone Landfall & High-Wind Shelter
• 🏚️ Earthquake "Drop, Cover, Hold On"
• ⚡ Lightning Storms & 30-30 Rule
• ⛰️ Landslides & Mudflow Evacuation
• ☀️ Heatwave & Heat Stroke First-Aid
• 🎒 72-Hour Evacuation Survival Kit
• 📡 Low-Bandwidth Distress Signaling

Please tap one of the suggested emergency prompts below or ask a specific disaster safety question.`,
    directives: [
      'Specify your emergency type (Flood, Cyclone, Earthquake, Lightning, Heat, Evacuation).',
      'For active life-threatening rescue, dial National Emergency 112 or NDRF 1078.',
    ],
    actionRecommendations: [
      'Flood Safety Steps',
      'Cyclone Landfall Guide',
      'Evacuation Kit Checklist',
      'Earthquake Drop-Cover-Hold',
      'Lightning 30-30 Rule',
      'Heat Stroke First Aid',
    ],
    confidence: 10,
  };
}
