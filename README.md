# SAGE — Self-care and Goal Engagement

> A trauma-informed wellness app with a companion that grows alongside you. No streaks. No shame. Just gentle progress.

Built for **InnovateHer 2026**. Built in 24 hours with React, Node.js, Firebase, and the Gemini API — and fully functional even without AI.

---

## What Is SAGE?

SAGE is a self-care habit tracker where completing daily goals nurtures a virtual companion — a plant or animal — that visually grows as you care for yourself. It layers in playful "girl math" motivation, milestone celebration popups, mood logging, and AI-powered gentle reflections, all designed around trauma-informed principles: no punishment for missing days, no calorie tracking, no guilt.

---

## Core Features

### Companion Growth
- Choose a **plant** or **animal** companion at signup
- Companion evolves through 4 visual SVG stages: **Baby → Teen → Young → Adult**
- Growth is driven by habit completion points
- A **progress bar** under your companion shows how close you are to the next growth stage — it gains 1 point per completed goal and never decreases or resets
- **Post-adult growth never stops** — plants bloom extra flowers, animals gain accessories (crown, bow tie, sparkles) — reinforcing that self-care is lifelong, not a destination
- **Name your companion** by clicking the name area — saved to your profile

### Habit Tracking (Daily / Weekly / Monthly)
- Three separate trackers, each with its own goal list
- Create fully custom habits with your own label and emoji
- Set a **goal frequency** (e.g., "meditate 5× this week") — the counter auto-checks when you hit your target
- Edit or delete habits at any time; deleting a checked habit correctly subtracts it from your total
- Emoji is clickable — cycle through options to personalize each habit

### Milestone Reward Popups
Completing key milestones triggers a confetti celebration popup with a message:

| Type | Milestones |
|------|-----------|
| **Daily** | 5, 10, 15 habits completed |
| **Weekly** | 1, 3, 5, 10 habits completed |

Popups only fire when you actually earn the milestone — not on login if you already have those habits saved.

### Girl Math
A rotating motivational message displayed after you complete habits, reframing small actions as meaningful progress. Examples:
- *"3 habits done = 6 companion growth points. That's basically free serotonin 🧠✨"*
- *"Consistency today builds strength tomorrow 🌱"*
- *"If each habit saves you $5 in future therapy, you just saved $15 today 💰"*

### Gentle Reflection
Click "Get Reflection" for a short, encouraging message. Powered by the **Gemini API** with a trauma-informed prompt — or falls back gracefully to 13+ curated messages with no API key needed. 10-second cooldown prevents spam.

### Mood Tracker
Log one mood per day (😊 happy, 😐 okay, 😢 sad, 😠 mad). Saved to your profile alongside habit data. Mood resets at **midnight local time** each day so every morning is a fresh start.

### Two Themes
Toggle between **🌻 Warm** (sage greens, cream) and **🌷 Pastel** (soft pinks, blush) — both WCAG-accessible.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (email/password) |
| AI | Google Gemini API (optional — app fully works without it) |
| Deploy | Vercel |

---

## Data Persistence

Every state change (completed habit, companion name, theme, mood) auto-saves to **Firestore** with a 1-second debounce. On login, all progress is restored exactly as left.

**Firestore document structure per user:**
```
/users/{uid}
  ├── companionType: 'plant' | 'animal'
  ├── companionName: string
  ├── habits: { daily, weekly, monthly } → { completed[], custom[], counts{} }
  ├── totalPoints: number
  ├── theme: 'warm' | 'pastel'
  ├── moodEntries: [{ date, mood }]
  └── timestamps
```

---

## Trauma-Informed Design Principles

1. **No streaks or punishment** — missing days has zero negative consequences
2. **No body or calorie tracking** — avoids triggering disordered eating
3. **Gentle language** — "Daily Goals" not "Tasks"; no shame framing
4. **Normalized inconsistency** — reflections validate off-days
5. **User autonomy** — fully custom habits, no prescriptive wellness
6. **Non-judgmental feedback** — nothing criticizes or compares
7. **Minority-safe** — abstract companion art (plants/animals), no cultural assumptions, no classist framing
8. **Post-adult growth** — reinforces self-care is a lifelong journey

---

## Project Structure

```
src/
├── components/
│   ├── Login.jsx           # Firebase email/password auth
│   ├── CompanionChoice.jsx # Onboarding: choose plant or animal
│   ├── Companion.jsx       # SVG companion with growth, naming, particles
│   ├── Habits.jsx          # Habit list with counters, edit, delete
│   ├── GirlMath.jsx        # Motivational girl math message card
│   ├── Reflection.jsx      # AI gentle reflection with fallbacks
│   ├── MoodTracker.jsx     # Daily mood emoji logger
│   └── RewardPopup.jsx     # Confetti milestone celebration popup
├── utils/
│   ├── helpers.js          # Girl math, milestone rewards, stage logic
│   └── database.js         # Firestore save/load functions
├── App.jsx                 # Main state, auth, milestone detection
└── index.css               # Tailwind + custom animations
server/
└── index.js                # Express + Gemini API endpoint
```

---

## Quick Start

```bash
git clone <repo-url>
cd InnovateHer2026
npm install

# Optional: add Gemini API key for AI reflections
cp .env.example .env
# Edit .env → GEMINI_API_KEY=your_key_here

npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

---

## Demo Flow (under 3 minutes)

1. **Sign up** with any email → choose plant or animal companion
2. **Name your companion** by clicking the name placeholder
3. **Add a custom habit** with a goal frequency counter
4. **Check off habits** → watch companion grow and girl math appear
5. **Hit 5 daily habits** → confetti reward popup fires
6. **Get a Reflection** → gentle AI message appears
7. **Log your mood** → emoji mood tracker
8. **Toggle theme** → warm ↔ pastel

---

MIT License · Built with care for InnovateHer 2026 💚
