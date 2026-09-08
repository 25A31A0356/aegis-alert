import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sendSuccess, sendError } from '../utils/response';
import { ChatMessage, ChatSource } from '../../../shared';

const router = Router();

// Comprehensive 9-Domain Disaster Safety Knowledge Base
const EMERGENCY_KNOWLEDGE = [
  {
    keywords: ['flood', 'water', 'submerged', 'drown', 'rain', 'inundation', 'overflow', 'river breach', 'dam'],
    category: 'Flood' as const,
    response:
      'FLOOD EMERGENCY PROTOCOL (NDMA Guidelines):\n1. High Ground: Move immediately to the highest floor or a designated reinforced high-ground shelter.\n2. Power & Gas: Turn off the main electrical circuit breaker and disconnect LPG cylinder regulator.\n3. 15cm / 30cm Rule: NEVER walk through flowing floodwaters (15cm can knock you down). NEVER drive into flooded streets (30cm can sweep cars away).\n4. Water Sanitation: Boil drinking water vigorously for at least 1 minute or use chlorine purification tablets.\n5. Keep phone in extreme power saving mode and monitor official SDMA/NDMA alerts.',
    actions: ['Check Safe Evacuation Shelters', 'Activate Red SOS Beacon', 'Call National Emergency 112'],
  },
  {
    keywords: ['cyclone', 'storm', 'wind', 'hurricane', 'typhoon', 'gale', 'landfall', 'surge'],
    category: 'Cyclone' as const,
    response:
      'CYCLONE SAFETY INSTRUCTIONS (IMD / NDMA):\n1. Stay indoors inside the innermost concrete room, corridor, or designated cyclone shelter away from glass windows.\n2. Secure or bring indoors all loose outdoor objects that could become airborne projectiles.\n3. EYE OF CYCLONE WARNING: If winds suddenly stop, DO NOT venture outside. Violent gale winds will resume abruptly from the opposite direction.\n4. Surges: If within 5km of coastline or in tidal inlets, evacuate along pre-identified high-ground ridge corridors.\n5. If structural walls crack, shelter under heavy solid tables or thick mattresses.',
    actions: ['Find Nearest Concrete Shelter', 'Offline Survival Checklist', 'Share Safe Status with Family'],
  },
  {
    keywords: ['earthquake', 'quake', 'tremor', 'shake', 'ground', 'drop cover hold', 'building shaking'],
    category: 'Earthquake' as const,
    response:
      'EARTHQUAKE SURVIVAL PROTOCOL:\n1. DROP down onto your hands and knees.\n2. COVER your head and neck under a sturdy table, desk, or reinforced structural corner.\n3. HOLD ON to your shelter until shaking stops.\n4. If outdoors, move to an open area away from buildings, overhead electrical wires, and streetlights.\n5. NEVER use elevators during or after tremors. Expect aftershocks.\n6. Check for gas leaks before flipping electrical switches.',
    actions: ['Offline Earthquake Guide', 'Mark "I Am Safe"', 'Report Structural Damage'],
  },
  {
    keywords: ['lightning', 'thunder', 'thunderstorm', 'electric shock', '30-30'],
    category: 'Lightning' as const,
    response:
      'LIGHTNING SAFETY (30-30 Rule):\n1. The 30-30 Rule: If the time between lightning flash and thunderclap is less than 30 seconds, seek shelter immediately. Remain indoors for 30 minutes after the last thunderclap.\n2. Shelter inside a substantial building or enclosed metal-topped vehicle (Faraday cage).\n3. Avoid contact with plumbing, taps, showers, corded phones, and electrical appliances.\n4. If trapped in the open with no shelter: Crouch low on the balls of your feet with hands on knees to minimize ground contact.',
    actions: ['View NDMA Lightning Guidelines', 'Report Fallen Power Line'],
  },
  {
    keywords: ['landslide', 'mudslide', 'rockfall', 'debris flow', 'mountain collapse', 'slope'],
    category: 'Landslide' as const,
    response:
      'LANDSLIDE & DEBRIS FLOW PROTOCOL:\n1. Warning Signs: Cracks in plaster or foundation, sticking doors/windows, tilting poles/trees, or sudden muddying of mountain stream water.\n2. Rapid Action: Move laterally across the slope out of the direct path of the flow towards stable bedrock.\n3. Avoid River Gullies: Do not shelter in low drainage channels or culverts where mudflow velocity peaks.',
    actions: ['View High Ground Routes', 'Report Blocked Hill Route'],
  },
  {
    keywords: ['heat', 'heatwave', 'heat stroke', 'exhaustion', 'sun stroke', 'dehydration'],
    category: 'Heatwave' as const,
    response:
      'EXTREME HEATWAVE & HEAT STROKE PROTOCOL:\n1. Heat Stroke Warning: High body temperature (>40°C), hot red dry skin, rapid pulse, and confusion. This is a medical emergency.\n2. Immediate Action: Call 108/112. Move patient to shaded/cool area, apply cool wet towels/ice packs to neck, armpits, and groin.\n3. Hydration: Drink 3-4 liters of water daily with Oral Rehydration Salts (ORS) or lemon water.\n4. Avoid outdoor exertion between 12:00 PM and 4:00 PM.',
    actions: ['Dial Ambulance (108)', 'Medical First Aid Guide'],
  },
  {
    keywords: ['kit', 'pack', 'checklist', 'prepare', 'supplies', 'food', '72 hour', 'carry', 'evacuation', 'what to take', 'what should i carry'],
    category: 'Checklist' as const,
    response:
      '72-HOUR DISASTER SURVIVAL "GO-BAG" CHECKLIST:\n1. Water: 3 Liters per person per day (minimum 9L per person) + purification tablets.\n2. Nutrition: High-calorie non-perishable food (energy bars, dry fruits, biscuits, canned items).\n3. Medical: First-aid kit + 14-day supply of daily prescription medicines.\n4. Documents: IDs (Aadhaar, Passport), insurance, bank passbooks in waterproof zip pouch.\n5. Tools: High-lumen LED torch + spare batteries, power bank, emergency rescue whistle.\n6. Sanitation: Masks, sanitizer, sanitary items, heavy-duty garbage bags.',
    actions: ['Download Offline Checklist', 'View Survival Guide'],
  },
  {
    keywords: ['first aid', 'bleeding', 'fracture', 'cpr', 'burn', 'wound', 'injury', 'medical'],
    category: 'FirstAid' as const,
    response:
      'EMERGENCY FIRST RESPONSE:\n1. Severe Bleeding: Apply firm, continuous direct pressure using clean cloth or sterile gauze. Elevate wounded limb.\n2. Burns: Cool the burn under cold running clean water for at least 10 minutes. Do NOT apply ice, oil, or butter.\n3. Fracture: Immobilize the limb in the position found; do not attempt to straighten bones.\n4. Unresponsive: Call 108/112 and begin hands-only CPR (100-120 chest compressions/min).',
    actions: ['Dial Ambulance (108)', 'Find Medical Facilities', 'Activate Critical SOS'],
  },
];

/**
 * Call external cloud AI provider if API key is present in environment variables.
 * Fallback gracefully if network / API limits occur.
 */
async function callOnlineAiProvider(userQuery: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const systemPrompt = `You are Aegis, an emergency AI assistant for disaster management in India. 
Follow NDMA (National Disaster Management Authority) guidelines. Provide concise, life-saving, numbered action steps. 
Highlight critical hazards, power/gas precautions, and high-ground shelter directions. 
Always include a reminder to contact 112 or 1078 for active rescue operations. Do not exceed 200 words.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Emergency Query: ${userQuery}` }],
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as any;
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return candidate.trim();
      }
    }
  } catch (err: any) {
    console.warn('[Online AI Provider] API call failed, falling back to offline KB:', err.message);
  }

  return null;
}

// POST /api/chat - Query Ask Aegis Emergency Assistant
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, forceOffline = false } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return sendError(res, 'Message text is required', 400);
    }

    const cleanInput = message.toLowerCase();
    let responseText = '';
    let category: any = undefined;
    let actionRecommendations: string[] = ['Check Alerts', 'View Safe Evacuation', 'Emergency Helplines'];
    let source: ChatSource = 'OFFLINE_KB';

    // 1. Try Online AI if not forced offline
    if (!forceOffline) {
      const onlineAiResponse = await callOnlineAiProvider(message);
      if (onlineAiResponse) {
        responseText = onlineAiResponse;
        source = 'ONLINE_AI';
        actionRecommendations = ['View Evacuation Routes', 'Check Nearest Shelters', 'Emergency 112'];
      }
    }

    // 2. Fallback to Local Knowledge Base if Online AI was not used or failed
    if (!responseText) {
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

      if (bestMatch && highestScore > 0) {
        responseText = bestMatch.response;
        category = bestMatch.category;
        actionRecommendations = bestMatch.actions;
      } else {
        responseText =
          'AEGIS EMERGENCY ASSISTANT (OFFLINE KNOWLEDGE BASE):\nI am operating in local offline emergency guidance mode based on NDMA disaster protocols. I can immediately guide you on:\n• 🌊 Flood evacuation & rising water survival\n• 🌀 Cyclone preparation & gale wind protection\n• 🏚️ Earthquake "Drop, Cover, Hold On"\n• ⚡ Lightning safety & the 30-30 Rule\n• ⛰️ Landslide early warning signs & slope evacuation\n• ☀️ Extreme heatwave & heat stroke first-aid\n• 🎒 72-hour survival kit & go-bag essentials\n\nPlease ask a specific emergency question or tap one of the suggested prompts below.';
        actionRecommendations = ['Flood Safety', 'Cyclone Guide', 'Evacuation Kit', 'Earthquake Protocol', 'Heat Stroke First Aid'];
      }
      source = 'OFFLINE_KB';
    }

    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();

    // Store user message in DB
    await db.run(
      `INSERT INTO chat_messages (id, sender, text, source, emergency_category, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`user_${Date.now()}`, 'user', message.trim(), source, category || null, now]
    );

    // Store assistant message in DB
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

    return sendSuccess(res, chatResponse, { source });
  } catch (error: any) {
    console.error('[Chat API Error]:', error);
    return sendError(res, 'Internal server error processing emergency query', 500);
  }
});

// GET /api/chat/history - Retrieve Recent Emergency Queries
router.get('/chat/history', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all<any>(
      `SELECT * FROM chat_messages ORDER BY timestamp ASC LIMIT 50`
    );

    const messages: ChatMessage[] = rows.map((r) => ({
      id: r.id,
      sender: r.sender,
      text: r.text,
      timestamp: r.timestamp,
      source: r.source as ChatSource,
      emergencyCategory: r.emergency_category,
      actionRecommendations: JSON.parse(r.action_recommendations || '[]'),
    }));

    return sendSuccess(res, messages);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch chat history', 500);
  }
});

// DELETE /api/chat/history - Clear Conversation History
router.delete('/chat/history', async (_req: Request, res: Response) => {
  try {
    await db.run(`DELETE FROM chat_messages`);
    return sendSuccess(res, { message: 'Chat history cleared successfully' });
  } catch (error: any) {
    return sendError(res, 'Failed to clear chat history', 500);
  }
});

export default router;
