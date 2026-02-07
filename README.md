# 🌸 HabitBloom

**A trauma-informed mind-wellness app with gamified "girl math" elements and companion growth that continues after adulthood.**

Built for hackathons — designed with care.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd habitbloom
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your Gemini API key (optional — fallbacks work without it)

# 3. Run both frontend + backend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🏗️ Project Structure

```
habitbloom/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Mock email login
│   │   ├── CompanionChoice.jsx # Plant or animal selection
│   │   ├── Companion.jsx      # SVG companion with growth animations
│   │   ├── Habits.jsx         # Daily self-care checklist
│   │   ├── Goals.jsx          # Personal goal creation & tracking
│   │   ├── GirlMath.jsx       # Gamified progress messages
│   │   └── Reflection.jsx     # AI-powered gentle reflections
│   ├── utils/
│   │   └── helpers.js         # State management, girl math, defaults
│   ├── App.jsx                # Main app orchestrator
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind + custom styles + animations
├── server/
│   └── index.js               # Express API with Gemini integration
├── public/
│   └── favicon.svg
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                # Ready for Vercel deployment
└── .env.example
```

**Team division**: Each component file is independent — assign Login+CompanionChoice to person A, Habits+Goals+GirlMath to person B, and Companion+Reflection+Backend to person C.

---

## 🌿 How the Companion Grows

Your companion evolves through four visual stages based on **growth points** earned from completing habits and goals:

| Stage | Points | Plant Visual | Animal Visual |
|-------|--------|-------------|---------------|
| **Baby** | 0–9 | Small sprout | Tiny kitten |
| **Teen** | 10–24 | Small leaves | Growing cat |
| **Young** | 25–49 | Foliage + bud | Happy cat with tail |
| **Adult** | 50+ | Full bloom with flower | Full cat with whiskers |

### Post-Adult Growth (Continuous Rewards)
Once your companion reaches adulthood, growth **doesn't stop**. Every 5–8 additional points earned triggers:

- **Plants**: Extra flowers bloom, sparkle effects appear
- **Animals**: Accessories appear (flower crown, bow tie, sparkles, stars)
- **Both**: Particle effects (✨🌸💖) animate on screen
- **Reflections**: AI messages acknowledge the ongoing journey

This design ensures users stay engaged long after "completing" growth.

---

## 💅 Girl Math Gamification

Girl Math reframes small daily actions as meaningful progress toward goals:

- **Time math**: "You invested 30 minutes in yourself — that's 0.5 hours of pure self-care! 💅"
- **Goal math**: "Completing 3 habits today gets you 15% closer to 'Save $50' ✨"
- **Fun math**: "If each habit saves $5 in future therapy, you just saved $25 today 💰"

Users assign **unit values** to goals (e.g., each habit = $5 toward a $50 goal), making progress feel tangible and fun.

---

## 🪷 AI Reflections

### How It Works
1. User clicks "Get Reflection"
2. Frontend sends current state to `/api/reflect`
3. Backend builds a trauma-informed prompt and calls **Gemini API**
4. Returns a 2-3 sentence gentle, encouraging message
5. If Gemini fails, curated fallback messages are used

### Prompt Design Principles
- Warm, kind, non-judgmental tone
- Normalizes inconsistency ("off days are valid")
- No medical advice, no streaks, no guilt
- Avoids parasocial phrases ("I'm proud of you")
- Adapts based on companion stage (post-adult messages emphasize ongoing care)

### Sample Prompt Template
```
You are a warm, gentle, trauma-informed wellness companion.
The user has a [plant/animal] companion at the "[stage]" stage.
Today they completed [N] self-care habit(s).
Write a SHORT reflection (2-3 sentences max) that is warm,
kind, and non-judgmental...
```

### Fallback Messages (No API Key Needed)
The app includes 13+ curated fallback messages that work without any API key, including post-adult specific messages.

---

## 🎨 Themes

Toggle between two calming color themes:

- **🌻 Warm**: Sage greens, soft ambers, cream backgrounds
- **🌷 Pastel**: Soft pinks, rose accents, blush backgrounds

Both themes maintain WCAG-accessible contrast ratios.

---

## 💚 Trauma-Informed Design Principles

HabitBloom is built on trauma-informed care principles:

1. **No streaks or punishments** — Missing a day has zero negative consequences
2. **No calorie/weight tracking** — Avoids triggering disordered eating
3. **Gentle language** — "Today's Care" not "Daily Tasks"; "No pressure" messaging
4. **Normalized inconsistency** — AI reflections validate off-days
5. **User autonomy** — Custom habits and goals, no prescriptive wellness
6. **Privacy-first** — All data stored in localStorage, never transmitted
7. **Non-judgmental feedback** — Reflections never criticize or compare
8. **Inclusive design** — No gendered assumptions, culturally neutral imagery
9. **Accessible** — Semantic HTML, readable fonts, sufficient contrast
10. **Post-adult growth** — Reinforces that self-care is lifelong, not a destination

### Minority-Safe Design
- No cultural assumptions in habits or goals
- Companion art is abstract (plants/animals, not human representations)
- Girl Math is opt-in and playful, not prescriptive
- Language avoids ableist, classist, or body-focused framing
- Economic examples are adjustable (users set their own goal values)

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add GEMINI_API_KEY
```

The included `vercel.json` handles routing the API and static files.

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google Gemini API key. App works with fallback messages without it. |
| `PORT` | No | Backend port (default: 3001) |

---

## 📱 Demo Script (< 3 minutes)

1. **Login** → Enter any email (30s)
2. **Choose companion** → Pick plant or animal (15s)
3. **Check habits** → Complete 3-4 habits, watch companion grow (30s)
4. **Add a goal** → "Save $50" with unit value 5 (20s)
5. **Show Girl Math** → Point out the fun progress messages (15s)
6. **Get Reflection** → Show the AI-generated kind message (15s)
7. **Toggle theme** → Switch between warm and pastel (5s)
8. **Explain post-adult** → "Growth continues forever — just like real wellness" (10s)

---

## 📄 License

MIT — Built with 💚 for hackathons.
