import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

// ── Gemini API call ──
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null; // Will trigger fallback
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch (err) {
    console.error('Gemini call failed:', err.message);
    return null;
  }
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

Write a SHORT reflection (2-3 sentences max) that is:
- Warm, kind, and non-judgmental
- Normalizes inconsistency (it's okay to have off days)
- Does NOT include medical advice, streak counts, or guilt
- Does NOT use phrases like "I'm proud of you" (avoid parasocial dynamics)
- Focuses on self-compassion and gentle acknowledgment
- ${habitCount === 0 ? 'Acknowledges that showing up is enough, even without completing habits' : 'Celebrates their effort without making it conditional'}

Respond with ONLY the reflection text, no quotes or labels.`;
}

// ── /api/reflect endpoint ──
app.post('/api/reflect', async (req, res) => {
  try {
    const { completedHabits, activityLevel, goalsCompleted, companionType, companionStage } = req.body;

    const prompt = buildPrompt({ completedHabits, activityLevel, goalsCompleted, companionType, companionStage });

    const geminiResponse = await callGemini(prompt);

    if (geminiResponse) {
      return res.json({ reflection: geminiResponse, source: 'gemini' });
    }

    // Fallback
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
