import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { ChatMessage, ChatSource } from '../../../shared';

const router = Router();

// Local disaster safety knowledge base matching algorithm
const EMERGENCY_KNOWLEDGE = [
  {
    keywords: ['flood', 'water', 'submerged', 'drown', 'rain', 'inundation', 'overflow'],
    category: 'Flood' as const,
    response:
      'FLOOD EMERGENCY PROTOCOL:\n1. Move immediately to higher ground or top floors of multi-story concrete structures.\n2. Turn off the main electrical switch and LPG cylinder regulator.\n3. NEVER walk, swim, or drive through flowing floodwaters (15cm of water can knock you down, 30cm can float cars).\n4. Boil drinking water before consumption or use chlorine tablets.\n5. Keep your phone charged, battery-saving mode ON, and monitor official SDMA/NDMA alerts.',
    actions: ['Check Safe Evacuation Shelters', 'Activate Red SOS Beacon', 'Call National Emergency 112'],
  },
  {
    keywords: ['cyclone', 'storm', 'wind', 'hurricane', 'typhoon', 'gale'],
    category: 'Cyclone' as const,
    response:
      'CYCLONE SAFETY INSTRUCTIONS:\n1. Stay indoors away from glass windows; relocate to the innermost room, corridor, or designated cyclone shelter.\n2. Secure or bring indoors all loose outdoor objects that could become airborne missiles.\n3. Disconnect all electrical appliances to prevent damage from power surges.\n4. If building begins to collapse, protect yourself under sturdy wooden tables or mattresses.\n5. Do not venture out when the eye of the cyclone passes (the calm period is brief, followed by violent reverse winds).',
    actions: ['Find Nearest Concrete Shelter', 'Offline Survival Checklist', 'Share Safe Status with Family'],
  },
  {
    keywords: ['earthquake', 'quake', 'tremor', 'shake', 'ground', 'building shaking'],
    category: 'Earthquake' as const,
    response:
      'EARTHQUAKE SURVIVAL PROTOCOL:\n1. DROP to your hands and knees.\n2. COVER your head and neck under a sturdy table or desk.\n3. HOLD ON until shaking stops.\n4. If outdoors, move to an open area away from buildings, overhead wires, and streetlights.\n5. DO NOT use elevators during or immediately after tremors. Expect aftershocks.',
    actions: ['Offline Earthquake Guide', 'Mark "I Am Safe"', 'Report Structural Damage'],
  },
  {
    keywords: ['lightning', 'thunder', 'thunderstorm', 'electric shock'],
    category: 'Lightning' as const,
    response:
      'LIGHTNING SAFETY (30-30 Rule):\n1. Seek shelter inside a substantial building or enclosed metal-topped vehicle.\n2. Stay away from tall isolated trees, open water, metal fences, and high ground.\n3. Avoid taking baths, showers, or using corded landline phones during active lightning storms.\n4. If trapped in the open with no shelter, crouch down low on the balls of your feet with hands on knees to minimize ground contact.',
    actions: ['View NDMA Lightning Guidelines', 'Report Fallen Power Line'],
  },
  {
    keywords: ['first aid', 'bleeding', 'fracture', 'cpr', 'burn', 'wound', 'injury', 'medical'],
    category: 'FirstAid' as const,
    response:
      'EMERGENCY FIRST RESPONSE:\n1. Severe Bleeding: Apply firm, continuous direct pressure using a clean cloth or sterile gauze. Elevate the wounded limb if possible.\n2. Burns: Cool the burn under cold running clean water for at least 10 minutes. Do not apply ice, butter, or oil.\n3. Suspected Fracture: Immobilize the limb in the position found; do not attempt to straighten bones.\n4. Unresponsive / No Breathing: Call 108/112 and begin hands-only CPR (100-120 chest compressions per minute).',
    actions: ['Dial Ambulance (108)', 'Find Medical Facilities', 'Activate Critical SOS'],
  },
  {
    keywords: ['kit', 'pack', 'checklist', 'prepare', 'supplies', 'food', '72 hour'],
    category: 'Checklist' as const,
    response:
      '72-HOUR DISASTER SURVIVAL KIT:\n1. 3 Liters of drinking water per person per day.\n2. High-calorie non-perishable food (dry fruits, energy bars, biscuits, canned goods).\n3. Battery-powered / hand-crank LED torch & spare batteries.\n4. Power bank with charging cables.\n5. Fully stocked first aid kit with personal prescription medicines.\n6. Waterproof pouch for Aadhaar, voter ID, bank passbook, and insurance documents.\n7. Emergency whistle & N95 masks.',
    actions: ['Download Offline Checklist', 'View Survival Guide'],
  },
];

// POST /api/chat - Query Ask Aegis Emergency Assistant
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, forceOffline = true } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return sendError(res, 'Message text is required', 400);
    }

    const cleanInput = message.toLowerCase();
    let bestMatch: (typeof EMERGENCY_KNOWLEDGE)[0] | null = null;
    let highestScore = 0;

    for (const item of EMERGENCY_KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (cleanInput.includes(kw)) {
          score += 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    let responseText = '';
    let category: any = undefined;
    let actionRecommendations: string[] = ['Check Alerts', 'View Safe Evacuation', 'Emergency Helplines'];
    const source: ChatSource = 'OFFLINE_KB';

    if (bestMatch && highestScore > 0) {
      responseText = bestMatch.response;
      category = bestMatch.category;
      actionRecommendations = bestMatch.actions;
    } else {
      responseText =
        'AEGIS EMERGENCY ASSISTANT (OFFLINE MODE):\nI am operating in local offline emergency guidance mode. I can help you with:\n• Flood evacuation & survival rules\n• Cyclone preparation & wind protection\n• Earthquake Drop, Cover, Hold\n• Lightning precautions\n• 72-hour emergency checklist\n• Emergency First-Aid response\n\nPlease ask a specific emergency question or select an option below.';
      actionRecommendations = ['Flood Safety', 'Cyclone Guide', 'First Aid Guidance', '72-Hr Emergency Kit'];
    }

    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();

    // Store user message
    await db.run(
      `INSERT INTO chat_messages (id, sender, text, source, emergency_category, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`msg_u_${Date.now()}`, 'user', message, source, category || null, now]
    );

    // Store assistant response
    await db.run(
      `INSERT INTO chat_messages (id, sender, text, source, emergency_category, action_recommendations, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, 'aegis', responseText, source, category || null, JSON.stringify(actionRecommendations), now]
    );

    const chatResponse: ChatMessage = {
      id,
      sender: 'aegis',
      text: responseText,
      timestamp: now,
      source,
      emergencyCategory: category,
      actionRecommendations,
    };

    sendSuccess(res, chatResponse, { source: 'OFFLINE_KB' });
  } catch (err: any) {
    sendError(res, err.message);
  }
});

// GET /api/chat/history
router.get('/chat/history', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>('SELECT * FROM chat_messages ORDER BY timestamp ASC LIMIT 50');
    const messages: ChatMessage[] = rows.map((r) => ({
      id: r.id,
      sender: r.sender,
      text: r.text,
      timestamp: r.timestamp,
      source: r.source,
      emergencyCategory: r.emergency_category,
      actionRecommendations: JSON.parse(r.action_recommendations || '[]'),
    }));
    sendSuccess(res, messages);
  } catch (err: any) {
    sendError(res, err.message);
  }
});

export default router;
