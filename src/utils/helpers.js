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

// Daily girl math: randomly picks one message from the pool below.
const DAILY_GIRL_MATH = (habitCount) => [
  `${habitCount} habit${habitCount > 1 ? 's' : ''} done. That's real progress. 🌸`,
  `Small steps still move you forward. ✨`,
  `Consistency today builds strength tomorrow. 🌱`,
  `Every habit is a vote for yourself. 🗳️`,
  `You chose yourself ${habitCount} time${habitCount > 1 ? 's' : ''} today. 💖`,
  `${habitCount} small acts of care. That's everything. 🧘`,
  `${habitCount} habits done = ${habitCount * 2} companion growth points. That's basically free serotonin 🧠✨`,
  `If each habit saves you $5 in future therapy, you just saved $${habitCount * 5} today. Girl math says that's profit 💰`,
  `${habitCount} small acts of care today × 365 days = ${habitCount * 365} moments of choosing yourself this year 🌸`,
];

export function generateGirlMath(completedHabits) {
  if (completedHabits.length === 0) return [];

  const habitCount = completedHabits.length;
  const pool = DAILY_GIRL_MATH(habitCount);
  return [pool[Math.floor(Math.random() * pool.length)]];
}

// ── Milestone rewards ──
// Edit message and emoji freely for each level.

// Weekly milestones: triggered by habits.weekly.completed count
export const WEEKLY_MILESTONES = {
  1:  { emoji: '☕', message: "Good job girl! Take a 15 min break!" },
  3:  { emoji: '🧁', message: "Don't forget to fuel your brain, grab a snack or a sweet treat!" },
  5:  { emoji: '🚶', message: "Change your environment, take a walk or see a friend!" },
  10: { emoji: '💅', message: "Check something off your wish list, you earned it!" },
};

// Daily milestones: triggered by habits.daily.completed count
export const DAILY_MILESTONES = {
  5:  { emoji: '👏', message: "Way to go! Pat yourself on the back!" },
  10: { emoji: '💃', message: "10 goals, wow! Dance it out!" },
  15: { emoji: '🎨', message: "Congrats! Set aside 15 minutes for your favorite hobby!" },
};

// Monthly milestones: triggered by habits.monthly.completed count
export const MONTHLY_MILESTONES = {
  1:  { emoji: '🍫', message: "You crushed your first monthly goal! Treat yourself to something small and sweet!" },
  3:  { emoji: '🎉', message: "You did it! Celebrate with your favorite activity!" },
  10: { emoji: '🏆', message: "Good girlllll daddy says thank you" },
  15: { emoji: '🌟', message: "Roll a fat blunt and light that sh*t upppp" },
  20: { emoji: '🎉', message: "GET CROSSEDDDDD" },
};


export function getWeeklyMilestoneReward(count) {
  return WEEKLY_MILESTONES[count] || null;
}

export function getDailyMilestoneReward(count) {
  return DAILY_MILESTONES[count] || null;
}

export function getMonthlyMilestoneReward(count) {
  return MONTHLY_MILESTONES[count] || null;
}

// ── Activity level from habits ──
export function getActivityLevel(completedCount) {
  if (completedCount >= 5) return 'high';
  if (completedCount >= 2) return 'medium';
  return 'low';
}
