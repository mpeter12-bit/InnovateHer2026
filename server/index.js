import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (parent directory)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Rate limiting ──
const requestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 10 requests per minute

// ── Fallback messages (used when Gemini API fails or key is missing) ──
const FALLBACK_MESSAGES = [
  "You're showing up in your own way today — that counts!",
  "Small acts of care are meaningful — keep going.",
  "Your companion is grateful for your presence, however it looks today.",
  "There's no wrong way to take care of yourself. You're doing it.",
  "Every gentle moment you give yourself matters more than you know.",
  "Progress isn't always visible, but it's always real.",
  "You chose yourself today. That takes courage.",
  "Rest is productive. Stillness is growth. You are enough.",
];

const POST_ADULT_FALLBACKS = [
  "Your companion is fully grown, but your habits continue to nourish your wellbeing.",
  "Even though your companion is mature, your care continues to make a difference.",
  "A fully bloomed companion still needs your light — and so do you.",
  "Growth doesn't stop at 'done.' You're proof that care is continuous.",
  "Your companion sparkles a little more with every kind thing you do for yourself.",
];

// ── Gemini API call with retry logic ──
async function callGemini(prompt, retries = 1) {
  const apiKey = process.env.GEMINI_API_KEY;

  // TEMPORARY: Disable Gemini API and use fallbacks only
  // Comment out this line once you have a working API key
  //return null;

  console.log('🔍 callGemini called');
  console.log('📝 API Key present:', apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : 'No');

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('❌ No valid API key found');
    return null; // Will trigger fallback
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      console.log('📡 API Response Status:', response.status);

      if (response.status === 429) {
        console.warn(`⏳ Rate limit hit (attempt ${attempt + 1}/${retries + 1})`);
        if (attempt < retries) {
          // Exponential backoff: wait 2^attempt seconds
          await new Promise(resolve => setTimeout(resolve, 1 * 1000));
          continue;
        }
        return null; // Out of retries
      }

      if (!response.ok) {
        console.error('❌ Gemini API error:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return null;
      }

      const data = await response.json();
      console.log('📦 API Response:', JSON.stringify(data, null, 2));
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ Generated text:', text ? text.substring(0, 50) + '...' : 'null');
      return text?.trim() || null;
    } catch (err) {
      console.error('❌ Gemini call failed:', err.message);
      console.error('Full error:', err);
      if (attempt === retries) return null;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
}

// ── Build prompt template ──
function buildPrompt({ completedHabits, activityLevel, goalsCompleted, companionType, companionStage }) {
  const habitCount = completedHabits?.length || 0;
  const goalsDone = goalsCompleted?.length || 0;

  return `You are a warm, gentle, trauma-informed wellness companion in an app called HabitBloom.

The user has a ${companionType} companion at the "${companionStage}" growth stage.
Today they completed ${habitCount} self-care habit(s): ${completedHabits?.join(', ') || 'none yet'}.
Their overall activity level today is: ${activityLevel}.
Goals completed so far: ${goalsDone > 0 ? goalsCompleted.join(', ') : 'none yet'}.

${companionStage === 'adult' ? `Their companion is fully grown. Acknowledge this milestone while emphasizing that growth and self-care are ongoing, lifelong journeys. Mention that their companion continues to thrive because of their care.` : `Their companion is still growing. Gently encourage them without pressure.`}

Write one SHORT full sentence (10 words max) that is:
- Warm, kind, and non-judgmental
- Normalizes inconsistency (it's okay to have off days)
- Does NOT include medical advice, streak counts, or guilt
- Does NOT use phrases like "I'm proud of you" (avoid parasocial dynamics)
- Focuses on self-compassion and gentle acknowledgment
- ${habitCount === 0 ? 'Acknowledges that showing up is enough, even without completing habits' : 'Celebrates their effort without making it conditional'}

Respond with ONLY the reflection text, no quotes or labels. MAKE SURE the sentence is complete and ends with a period or an exclamation mark. Do NOT return if the sentence is incomplete.`;
}

// ── /api/reflect endpoint with rate limiting & caching ──
app.post('/api/reflect', async (req, res) => {
  try {
    const { completedHabits, activityLevel, goalsCompleted, companionType, companionStage } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    // Rate limiting check
    const now = Date.now();
    if (!requestTimestamps.has(clientIp)) {
      requestTimestamps.set(clientIp, []);
    }

    const timestamps = requestTimestamps.get(clientIp);
    const recentRequests = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`Rate limit exceeded for ${clientIp}`);
      // Return cached or fallback instead of error
      const pool = companionStage === 'adult'
        ? [...FALLBACK_MESSAGES, ...POST_ADULT_FALLBACKS]
        : FALLBACK_MESSAGES;
      const fallback = pool[Math.floor(Math.random() * pool.length)];
      return res.json({ reflection: fallback, source: 'rate-limited' });
    }

    recentRequests.push(now);
    requestTimestamps.set(clientIp, recentRequests);

    // Generate fresh response every time (caching disabled for variety)
    const prompt = buildPrompt({ completedHabits, activityLevel, goalsCompleted, companionType, companionStage });
    console.log('🤖 Calling Gemini API for fresh response...');
    const geminiResponse = await callGemini(prompt);

    if (geminiResponse) {
      const endsWithPunctuation = /[.!?]$/.test(geminiResponse.trim());
      if (endsWithPunctuation) {
        console.log('✨ Fresh Gemini response received (complete sentence)');
        return res.json({ reflection: geminiResponse, source: 'gemini' });
      } else {
        console.warn('⚠️ Gemini response incomplete, using fallback. Was:', geminiResponse);
      }
    }

    // Fallback
    console.log('⚠️ Using fallback message (Gemini returned null)');
    const pool = companionStage === 'adult'
      ? [...FALLBACK_MESSAGES, ...POST_ADULT_FALLBACKS]
      : FALLBACK_MESSAGES;
    const fallback = pool[Math.floor(Math.random() * pool.length)];
    return res.json({ reflection: fallback, source: 'fallback' });

  } catch (err) {
    console.error('Reflect endpoint error:', err);
    return res.json({
      reflection: "You're showing up in your own way today — that counts!",
      source: 'error-fallback',
    });
  }
});

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌸 HabitBloom API running on port ${PORT}`);
});
