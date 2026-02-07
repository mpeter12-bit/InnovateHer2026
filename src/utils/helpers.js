// ── localStorage helpers ──
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(`habitbloom_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  localStorage.setItem(`habitbloom_${key}`, JSON.stringify(value));
}

// ── Default habits (trauma-informed, gentle) ──
export const DEFAULT_HABITS = [
  { id: 'water', label: 'Drink a glass of water', emoji: '💧', points: 1 },
  { id: 'walk', label: 'Take a short walk', emoji: '🚶', points: 2 },
  { id: 'journal', label: 'Write in your journal', emoji: '📝', points: 2 },
  { id: 'meditate', label: 'Meditate or breathe deeply', emoji: '🧘', points: 2 },
  { id: 'cook', label: 'Cook or prep a meal', emoji: '🍳', points: 2 },
  { id: 'rest', label: 'Take a mindful rest', emoji: '😌', points: 1 },
  { id: 'stretch', label: 'Gentle stretching', emoji: '🌊', points: 1 },
  { id: 'connect', label: 'Reach out to someone', emoji: '💌', points: 2 },
];

// ── Companion stage logic ──
export function getCompanionStage(totalPoints) {
  if (totalPoints >= 50) return 'adult';
  if (totalPoints >= 25) return 'young';
  if (totalPoints >= 10) return 'teen';
  return 'baby';
}

export function getStageProgress(totalPoints) {
  if (totalPoints >= 50) return { stage: 'adult', progress: 1, postAdultPoints: totalPoints - 50 };
  if (totalPoints >= 25) return { stage: 'young', progress: (totalPoints - 25) / 25 };
  if (totalPoints >= 10) return { stage: 'teen', progress: (totalPoints - 10) / 15 };
  return { stage: 'baby', progress: totalPoints / 10 };
}

// ── Girl Math messages ──
export function generateGirlMath(completedHabits, goals) {
  const messages = [];
  const habitCount = completedHabits.length;

  if (habitCount === 0) return messages;

  // Time-based girl math
  const totalMinutes = habitCount * 10;
  if (totalMinutes >= 20) {
    messages.push(`You invested ${totalMinutes} minutes in yourself today — that's ${Math.round(totalMinutes / 60 * 100) / 100} hours of pure self-care! 💅`);
  }

  // Goal-progress girl math
  goals.forEach((goal) => {
    if (goal.unitValue && goal.target) {
      const progressPercent = Math.min(100, Math.round((habitCount * goal.unitValue / goal.target) * 100));
      if (progressPercent > 0) {
        messages.push(`Completing ${habitCount} habit${habitCount > 1 ? 's' : ''} today gets you ${progressPercent}% closer to "${goal.name}" ✨`);
      }
    }
  });

  // Fun girl math
  const funMessages = [
    `${habitCount} habits done = ${habitCount * 2} companion growth points. That's basically free serotonin 🧠✨`,
    `If each habit saves you $5 in future therapy, you just saved $${habitCount * 5} today. Girl math says that's profit 💰`,
    `${habitCount} small acts of care today × 365 days = ${habitCount * 365} moments of choosing yourself this year 🌸`,
    `You walked for 10 minutes? That's a free latte in wellness currency ☕`,
    `Journaling for 5 minutes is basically giving yourself a free therapy session. The math checks out 📓`,
  ];

  const randomIdx = Math.floor(Math.random() * funMessages.length);
  messages.push(funMessages[randomIdx]);

  return messages;
}

// ── Activity level from habits ──
export function getActivityLevel(completedCount) {
  if (completedCount >= 5) return 'high';
  if (completedCount >= 2) return 'medium';
  return 'low';
}
