export interface GuideCategory {
  id: string;
  title: string;
  hazardType: string;
  iconName: string;
  color: string;
  bgGradient: string;
  tagline: string;
  before: string[];
  during: string[];
  after: string[];
  dos: string[];
  donts: string[];
  checklist: string[];
}

export const SURVIVAL_GUIDE_DATA: GuideCategory[] = [
  // 1. FLOODS
  {
    id: 'flood',
    title: 'Floods & Coastal Inundation',
    hazardType: 'Flood',
    iconName: 'Waves',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
    tagline: 'Life-saving protocols for rising waters, flash floods, and storm surges',
    before: [
      'Identify verified local high-ground evacuation shelters and ridge routes in advance.',
      'Seal valuable identification documents (Aadhaar, passport, property deeds) in waterproof zip pouches.',
      'Install non-return check valves in building sewer traps to prevent drainage backflow.',
      'Stock 3 liters of drinking water per person per day for at least 72 hours.',
      'Move valuable appliances, machinery, and furniture to the 2nd floor or elevated lofts.',
    ],
    during: [
      'Turn off the main electrical circuit breaker and disconnect LPG cylinder regulators before evacuating.',
      'NEVER attempt to walk or wade through flowing water (15 cm of moving water can knock down an adult).',
      'NEVER drive into flooded roadways (30 cm of water can float small cars; 60 cm will sweep away large SUVs).',
      'Move to upper floors or roof of a reinforced concrete structure if trapped. Signal for rescue using a whistle.',
      'Do not shelter in closed attics unless there is an unobstructed roof escape hatch.',
    ],
    after: [
      'Boil all drinking/cooking water vigorously for at least 1 minute or use chlorine purification tablets.',
      'Watch out for displaced venomous snakes, scorpions, and sharp submerged debris during clean up.',
      'Do NOT turn on electrical switches or appliances until inspected and certified by an electrician.',
      'Discard all unsealed food items, medicines, and cosmetics that have come in contact with floodwater.',
      'Wear rubber boots and heavy gloves while clearing flood mud to prevent leptospirosis and infections.',
    ],
    dos: [
      'Drink only boiled, bottled, or chlorinated water.',
      'Keep mobile phones in extreme battery-saver mode for emergency communications.',
      'Follow NDRF, SDRF, and local police evacuation instructions immediately.',
      'Ascend to the highest accessible reinforced concrete floor.',
    ],
    donts: [
      'Do not touch downed power lines, transformers, or fallen utility poles.',
      'Do not eat food that has touched flood water, even if in sealed cans if damaged.',
      'Do not wade through water with open cuts or skin abrasions.',
      'Do not ignore official evacuation orders from disaster management authorities.',
    ],
    checklist: [
      '3 Liters sealed drinking water per person per day',
      'Water purification chlorine tablets / filter straw',
      'High-energy dry rations (dry fruits, biscuits, roasted gram)',
      'Waterproof LED torch with 2 sets of spare batteries',
      'First-aid medical kit with personal daily prescription medicines',
      'Aadhaar / Voter IDs in waterproof seal pouch',
      'Loud emergency rescue whistle',
    ],
  },

  // 2. CYCLONES
  {
    id: 'cyclone',
    title: 'Cyclones & Severe Gale Storms',
    hazardType: 'Cyclone',
    iconName: 'Wind',
    color: 'text-amber-400',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    tagline: 'Protection guidelines for hurricane-force winds, storm surges, and flying debris',
    before: [
      'Trim dead or overhanging tree branches that could crash onto house roofs or power lines.',
      'Secure or bring indoors all loose outdoor furniture, tin roofing sheets, and metal debris.',
      'Store a 72-hour supply of non-perishable food, water, and emergency medical supplies.',
      'Board up or tape large glass windows with heavy adhesive tape in an X-pattern to reduce glass shrapnel.',
      'Evacuate immediately if located within 5 km of the coastline or in low-lying tidal flood plains.',
    ],
    during: [
      'Stay strictly indoors in the strongest, innermost room without exterior glass windows.',
      'EYE OF THE CYCLONE WARNING: If winds suddenly stop and weather turns calm, DO NOT venture out. The eye of the storm is passing, and ferocious reverse gale winds will resume in minutes.',
      'Protect head and chest under heavy solid wooden tables or thick mattresses if structural walls rattle.',
      'Unplug electrical equipment to prevent catastrophic damage from sudden power grid surges.',
    ],
    after: [
      'Strictly avoid fallen power cables, dangling utility lines, and standing water pools near electrical poles.',
      'Check for gas leaks: smell for LPG. If detected, do not light matches or flip electrical switches; open windows and leave.',
      'Clear standing water around the home immediately to prevent post-disaster mosquito breeding (dengue/malaria).',
      'Avoid driving on roads obstructed by uprooted trees or collapsed billboard scaffolding.',
    ],
    dos: [
      'Keep mobile devices and emergency 20,000mAh power banks fully charged in advance.',
      'Monitor official IMD and SDMA weather radio broadcasts on 102.8 MHz.',
      'Anchor loose tin roof sheets with heavy sandbags or steel tie-downs.',
      'Help elderly neighbors and pregnant women reach verified cyclone shelters.',
    ],
    donts: [
      'Do not spread unverified rumors or panic messages on social media.',
      'Do not venture out to sea or coastal beaches during Orange/Red Cyclone alerts.',
      'Do not park vehicles under old trees, weak brick walls, or overhead advertising hoardings.',
      'Do not leave shelter during the temporary calm lull when the cyclone eye passes.',
    ],
    checklist: [
      'Battery-operated AM/FM transistor radio',
      '20,000mAh charged power bank & multi-pin charging cables',
      'Heavy-duty adhesive duct tape & poly sheets',
      'Emergency candle, matches in waterproof box & LED lanterns',
      '72-hour non-perishable food supply & manual can opener',
      'Complete first-aid kit with antiseptic and burn cream',
    ],
  },

  // 3. EARTHQUAKES
  {
    id: 'earthquake',
    title: 'Earthquakes & Seismic Shaking',
    hazardType: 'Earthquake',
    iconName: 'Activity',
    color: 'text-red-400',
    bgGradient: 'from-red-950/40 via-slate-900 to-slate-950',
    tagline: 'Drop, Cover, and Hold On protocols, stair evacuation, and aftershock safety',
    before: [
      'Fasten heavy shelves securely to load-bearing walls; anchor large mirrors, artwork, and TVs.',
      'Locate safe indoor spots in every room: underneath sturdy desks, heavy tables, or interior load corners.',
      'Learn how to shut off main gas valves and electrical circuit breakers.',
      'Keep heavy objects on lower shelves to prevent dangerous projectile hazards during shaking.',
    ],
    during: [
      'DROP down onto your hands and knees to prevent being knocked over.',
      'COVER your head and neck underneath a sturdy table, desk, or interior corner.',
      'HOLD ON to your shelter until shaking stops. If the shelter shifts, move with it.',
      'If in bed, stay there and protect your head and neck with a pillow.',
      'If outdoors, move to an open clearing away from buildings, overhead wires, streetlights, and brick parapets.',
      'NEVER use elevators during or immediately after tremors. Expect aftershocks.',
    ],
    after: [
      'Expect aftershocks: each tremor can cause further damage to already weakened structures.',
      'Smell for gas leaks. If you smell gas, open windows, do not flip switches, and evacuate the building immediately.',
      'Inspect chimneys, roof tiles, and load-bearing walls for cracks before re-entering.',
      'Wear heavy shoes and thick clothing to protect against shattered glass and sharp debris.',
    ],
    dos: [
      'Remember DROP, COVER, and HOLD ON whenever shaking begins.',
      'Use stairs carefully after shaking stops to evacuate damaged multistory buildings.',
      'Check family members for bleeding and injuries before moving them.',
    ],
    donts: [
      'Do not rush into stairwells or exits during active shaking.',
      'Do not stand in doorways (modern doorways are not stronger than the rest of the room).',
      'Do not light candles or matches until confirmed there are zero gas leaks.',
      'Do not re-enter cracked or tilted structures without municipal civil engineering clearance.',
    ],
    checklist: [
      'Sturdy work gloves and hard-sole safety boots',
      'Emergency rescue whistle to signal SAR teams',
      'High-lumen LED headlamp for hands-free navigation',
      'First-aid supplies (splints, bandages, sterile gauze, antiseptic)',
      'Multi-tool knife with pliers and screwdriver',
      'Emergency dust masks (N95) for masonry/dust protection',
    ],
  },

  // 4. LIGHTNING & THUNDERSTORMS
  {
    id: 'lightning',
    title: 'Lightning & Severe Thunderstorms',
    hazardType: 'Lightning',
    iconName: 'Zap',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-950/40 via-slate-900 to-slate-950',
    tagline: 'The 30-30 Rule, indoor appliance isolation, and open field crouch protection',
    before: [
      'Check local meteorological radar for squall and severe thunderstorm watches before outdoor travel.',
      'Ensure tall buildings and rural farm sheds have certified lightning arresters installed.',
      'Unplug non-essential electronic appliances and television coaxial cables prior to storm arrival.',
    ],
    during: [
      'THE 30-30 RULE: If the time between lightning flash and thunderclap is less than 30 seconds, seek indoor shelter immediately. Remain indoors for at least 30 minutes after the last thunderclap.',
      'Shelter inside a substantial building or enclosed metal-roofed motor vehicle (Faraday cage effect).',
      'Avoid contact with indoor plumbing: do NOT wash dishes, take showers, or touch metal taps.',
      'Stay away from isolated tall trees, open fields, metal fencing, transmission towers, and ponds.',
      'If caught in an open field with no shelter: Crouch low on the balls of your feet with heels touching, head tucked, and hands over ears. Minimize contact with the soil.',
    ],
    after: [
      'Wait a full 30 minutes after the last thunder rumble before resuming outdoor activities.',
      'Lightning victims do NOT carry an electrical charge: administer immediate CPR if unresponsive and not breathing.',
      'Report fallen power lines or ignited brushfires to local emergency fire services (101).',
    ],
    dos: [
      'Seek shelter in fully enclosed brick/concrete buildings or hard-top vehicles.',
      'Stay off corded landline phones; cellular mobile phones are safe to use indoors.',
      'Administer immediate chest compressions (CPR) to lightning strike victims.',
    ],
    donts: [
      'Do not seek shelter under isolated trees in open ground.',
      'Do not swim or remain in open lakes, rivers, or swimming pools during lightning.',
      'Do not lie flat on the ground (spreads ground current exposure across vital organs).',
      'Do not operate metal-handled agricultural equipment or bicycles during storms.',
    ],
    checklist: [
      'Battery-powered emergency weather radio',
      'Surge protectors on essential medical equipment',
      'Insulated emergency rainwear',
      'Emergency telephone contact numbers saved offline',
    ],
  },

  // 5. LANDSLIDES & MUDFLOWS
  {
    id: 'landslide',
    title: 'Landslides & Hill Slope Debris',
    hazardType: 'Landslide',
    iconName: 'Mountain',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    tagline: 'Slope stability warning signs, lateral evacuation paths, and mudflow avoidance',
    before: [
      'Learn about local geological landslide history and drainage slopes in your hill district.',
      'Plant deep-rooted ground cover vegetation on steep slopes to reduce surface erosion.',
      'Watch for warning signs: sticking doors/windows, new foundation cracks, or leaning utility poles.',
      'Plan at least two evacuation routes away from steep gullies and natural runoff channels.',
    ],
    during: [
      'If you hear a sudden roaring sound or tree trunks snapping, EVACUATE IMMEDIATELY.',
      'Move laterally (sideways) out of the path of the slide rather than trying to outrun it downhill.',
      'If escape is impossible, curl into a tight ball and protect your head with your arms and hands.',
      'Avoid river valleys and low culverts where debris flow speeds can exceed 50 km/h.',
    ],
    after: [
      'Stay away from the slide area; additional collapses and secondary mudflows often follow.',
      'Check for injured or trapped persons near the perimeter without entering the direct slide path.',
      'Report broken gas, water, or electrical lines to municipal response teams immediately.',
    ],
    dos: [
      'Listen for unusual sounds like trees cracking or boulders knocking together.',
      'Evacuate immediately if stream water suddenly turns murky or muddy.',
      'Help neighbors who require special mobility assistance.',
    ],
    donts: [
      'Do not build or sleep in direct downstream natural drainage gullies.',
      'Do not cross bridges if heavy mudflow and tree debris are battering the piers.',
      'Do not return to slide-impacted homes until certified safe by geologists.',
    ],
    checklist: [
      'Topographical hill sector map with ridge safety zones',
      'Emergency rescue whistle and loud signal horn',
      'Heavy-duty safety rope (15m)',
      'Waterproof LED headlamp and spare batteries',
      '72-hour emergency food rations & water purification',
    ],
  },

  // 6. HEAT EMERGENCIES & HEATWAVE
  {
    id: 'heatwave',
    title: 'Extreme Heatwave & Heat Stroke',
    hazardType: 'Heatwave',
    iconName: 'Sun',
    color: 'text-orange-500',
    bgGradient: 'from-orange-950/40 via-slate-900 to-slate-950',
    tagline: 'Heat stroke vs exhaustion differentiation, rapid cooling, and hydration protocols',
    before: [
      'Insulate home roofs and install reflective window shades, curtains, or bamboo blinds.',
      'Keep oral rehydration salts (ORS), glucose, lemons, and buttermilk readily available.',
      'Schedule strenuous outdoor labor and commuting during early morning or late evening hours.',
    ],
    during: [
      'HEAT STROKE WARNING: High body temp (&gt;40°C), hot red dry skin, rapid pulse, and confusion. This is a life-threatening medical emergency.',
      'EMERGENCY FIRST AID: Call 108/112. Move patient to shaded/air-conditioned area immediately.',
      'RAPID COOLING: Apply cold wet towels, ice packs to neck, armpits, and groin. Fan continuously.',
      'Drink 3-4 liters of water daily with ORS or electrolytes even if not feeling thirsty.',
      'Avoid caffeinated, sugary, or alcoholic drinks (accelerates dehydrating fluid loss).',
    ],
    after: [
      'Continue slow hydration with electrolyte fluids; do not chug ice-cold water all at once.',
      'Rest in a cool ventilated room for 24-48 hours after heat exhaustion recovery.',
      'Monitor infants and elderly family members for lethargy, sunken eyes, or reduced urination.',
    ],
    dos: [
      'Wear loose, light-colored, breathable cotton clothing and wide-brim hats.',
      'Cover your head with a wet cloth or umbrella when stepping outdoors.',
      'Give sips of cool water or ORS to conscious heat exhaustion patients.',
    ],
    donts: [
      'Do not leave children or pets unattended inside parked motor vehicles (deadly within 10 mins).',
      'Do not exert outdoors in direct sunlight between 12:00 PM and 4:00 PM.',
      'Do not give fluids to an unconscious or seizing heat stroke patient.',
    ],
    checklist: [
      'Oral Rehydration Salt (ORS) packets & glucose powder',
      'Digital clinical thermometer',
      'Instant cold ice packs',
      'Wide-brim sun protection hat & UV sunglasses',
      'Insulated 2-Liter stainless steel water flask',
    ],
  },

  // 7. GENERAL PREPAREDNESS
  {
    id: 'general',
    title: 'General Disaster Preparedness',
    hazardType: 'General',
    iconName: 'ShieldCheck',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    tagline: 'Household emergency plans, family reunification, power management, and go-bags',
    before: [
      'Create and rehearse a household disaster plan with two designated family meeting spots.',
      'Designate an out-of-state emergency contact person that all family members can SMS check-in with.',
      'Pack a standardized 72-hour survival Go-Bag for each household member near the front exit.',
      'Keep vehicle fuel tanks at least half-full during monsoon and cyclone seasons.',
    ],
    during: [
      'Stay calm, evaluate the immediate threat, and take designated shelter or evacuate as planned.',
      'Prioritize life safety over property: never delay evacuation to save non-essential material items.',
      'Conserve mobile phone battery: use text messages instead of voice calls to keep networks open.',
    ],
    after: [
      'Broadcast your "I Am Safe" Beacon to update loved ones and emergency queues.',
      'Check neighbors for injuries, especially elderly, disabled persons, and unaccompanied children.',
      'Document property damage with photos/videos for insurance claims before cleanup.',
    ],
    dos: [
      'Memorize essential emergency telephone numbers (112, 1078, 108).',
      'Keep copies of vital identification cards stored in waterproof bags and cloud drives.',
      'Maintain an updated household first-aid kit with unexpired medications.',
    ],
    donts: [
      'Do not overwhelm emergency telecom networks with non-critical voice calls.',
      'Do not enter disaster-damaged buildings without civil structural clearance.',
      'Do not touch utility electrical cables or gas fittings without emergency crew approval.',
    ],
    checklist: [
      'Complete 72-Hour Survival Kit Go-Bag',
      'Multi-voltage emergency power bank & solar charger',
      'Copies of Aadhaar, insurance, and medical records',
      'Emergency cash in small denomination notes',
      'High-decibel rescue whistle',
    ],
  },
];
