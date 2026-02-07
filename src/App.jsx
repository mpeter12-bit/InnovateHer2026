import React, { useState, useEffect, useCallback } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { saveUserData, loadUserData, createUserProfile } from './utils/database.js';
import Login from './components/Login.jsx';
import CompanionChoice from './components/CompanionChoice.jsx';
import Companion from './components/Companion.jsx';
import MoodTracker from './components/MoodTracker.jsx';
import Habits from './components/Habits.jsx';
import Goals from './components/Goals.jsx';
import GirlMath from './components/GirlMath.jsx';
import Reflection from './components/Reflection.jsx';
import { DEFAULT_HABITS } from './utils/helpers.js';

export default function App() {
  // ── Auth ──
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // ── App State ──
  const [companionType, setCompanionType] = useState(null);
  const [theme, setTheme] = useState('warm');

  // --Newly Added Object Habit States
  const [habits, setHabits] = useState({
    daily: {
      completed: [],
      custom: []
    },
    weekly: {
      completed: [],
      custom: []
    },
    monthly: {
      completed: [],
      custom: []
    },
  })
  /* const [completedHabits, setCompletedHabits] = useState([]);
  const [customHabits, setCustomHabits] = useState([]); */
  //const [goals, setGoals] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [moodEntries, setMoodEntries] = useState([]);

  // ── Listen for auth state changes (persists across refreshes) ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setDataLoading(true);

        // Load saved progress from Firestore
        const data = await loadUserData(user.uid);
        if (data) {
          setCompanionType(data.companionType || null);
          setHabits(data.habits || {
            daily: { completed: [], custom: [] },
            weekly: { completed: [], custom: [] },
            monthly: { completed: [], custom: [] }
          });
          setTotalPoints(data.totalPoints || 0);
          setTheme(data.theme || 'warm');
          setMoodEntries(data.moodEntries || []);
        } else {
          // First time — create profile
          await createUserProfile(user.uid, user.email);
        }

        setDataLoading(false);
      } else {
        setFirebaseUser(null);
        // Reset state
        setCompanionType(null);
        setHabits({
          daily: { completed: [], custom: [] },
          weekly: { completed: [], custom: [] },
          monthly: { completed: [], custom: [] }
        });
        setTotalPoints(0);
        setTheme('warm');
        setMoodEntries([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Auto-save to Firestore when state changes (debounced) ──
  useEffect(() => {
    if (!firebaseUser || authLoading || dataLoading) return;

    const timeout = setTimeout(() => {
      saveUserData(firebaseUser.uid, {
        companionType,
        habits,
        totalPoints,
        theme,
        moodEntries,
        email: firebaseUser.email,
      });
    }, 1000); // Debounce: save 1s after last change

    return () => clearTimeout(timeout);
  }, [companionType, habits, totalPoints, theme, moodEntries, firebaseUser, authLoading, dataLoading]);

  // ── Apply theme ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'pastel' ? 'pastel' : '');
  }, [theme]);

  // ── Handlers ──
  const handleLogin = (user) => {
    // Auth state listener handles the rest
  };

  const handleChooseCompanion = (type) => {
    setCompanionType(type);
  };

  /* const toggleHabit = useCallback((habitId) => {
    setCompletedHabits((prev) => {
      const allHabits = [...DEFAULT_HABITS, ...customHabits];
      const habit = allHabits.find((h) => h.id === habitId);
      if (prev.includes(habitId)) {
        if (habit) setTotalPoints((p) => Math.max(0, p - habit.points));
        return prev.filter((id) => id !== habitId);
      } else {
        if (habit) setTotalPoints((p) => p + habit.points);
        return [...prev, habitId];
      }
    });
  }, [customHabits]);

  const addCustomHabit = (habit) => {
    setCustomHabits((prev) => [...prev, habit]);
  }; */

  // Toggle a daily habit
  const toggleDailyHabit = (habitId) => {
    setHabits(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        completed: prev.daily.completed.includes(habitId)
          ? prev.daily.completed.filter(id => id !== habitId)
          : [...prev.daily.completed, habitId]
      }
    }));
  };

  const addDailyCustomHabit = (habit) => {
    setHabits(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        custom: [...prev.daily.custom, habit]
      }
    }))
  };

  const toggleWeeklyHabit = (habitId) => {
    setHabits(prev => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        completed: prev.weekly.completed.includes(habitId)
          ? prev.weekly.completed.filter(id => id !== habitId)
          : [...prev.weekly.completed, habitId]
      }
    }));
  };

  const addWeeklyCustomHabit = (habit) => {
    setHabits(prev => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        custom: [...prev.weekly.custom, habit]
      }
    }))
  };

  const toggleMonthlyHabit = (habitId) => {
    setHabits(prev => ({
      ...prev,
      monthly: {
        ...prev.monthly,
        completed: prev.monthly.completed.includes(habitId)
          ? prev.monthly.completed.filter(id => id !== habitId)
          : [...prev.monthly.completed, habitId]
      }
    }));
  };

  const addMonthlyCustomHabit = (habit) => {
    setHabits(prev => ({
      ...prev,
      monthly: {
        ...prev.monthly,
        custom: [...prev.monthly.custom, habit]
      }
    }))
  };

  /* const addGoal = (goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const completeGoal = (goalId) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: true } : g))
    );
    setTotalPoints((p) => p + 5);
  }; */

  const handleMoodSelect = (moodId) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    setMoodEntries((prev) => {
      // Check if there's already an entry for today
      const existingIndex = prev.findIndex(entry => entry.date === today);

      if (existingIndex !== -1) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = { date: today, mood: moodId, timestamp: Date.now() };
        return updated;
      } else {
        // Add new entry
        return [...prev, { date: today, mood: moodId, timestamp: Date.now() }];
      }
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // ── Companion stage ──
  const companionStage = totalPoints >= 50 ? 'adult' : totalPoints >= 25 ? 'young' : totalPoints >= 10 ? 'teen' : 'baby';

  // ── Get today's mood ──
  const today = new Date().toISOString().split('T')[0];
  const todayMoodEntry = moodEntries.find(entry => entry.date === today);
  const todayMood = todayMoodEntry ? todayMoodEntry.mood : null;
  
  // ── Combine all completed habits for Reflection ──
  const allCompletedHabits = [
    ...habits.daily.completed,
    ...habits.weekly.completed,
    ...habits.monthly.completed
  ];

  // ── Loading screen ──
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-bloom-in">
          <div className="text-5xl mb-4 animate-float">🌸</div>
          <p className="font-display text-lg" style={{ color: 'var(--text-secondary)' }}>
            Loading your garden...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ──
  if (!firebaseUser) return <Login onLogin={handleLogin} />;
  if (!companionType) return <CompanionChoice onChoose={handleChooseCompanion} />;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md px-4 py-3" style={{ background: 'rgba(255, 251, 245, 0.85)' }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-sway inline-block">🌸</span>
            <h1 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              SAGE: Self-care and Goal Engagement
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme((t) => (t === 'warm' ? 'pastel' : 'warm'))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
              style={{ background: 'var(--bg-secondary)' }}
              title="Toggle theme"
            >
              {theme === 'warm' ? '🌷' : '🌻'}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      


      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 mt-4 page-enter">
        <div className="flex gap-6">
          {/* Left Column - Static */}
          <div className="sticky top-20 self-start w-80 max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Welcome back, <span className="font-medium">{firebaseUser.email.split('@')[0]}</span> 💚
              </p>
            </div>

            {/* Companion */}
            <Companion type={companionType} totalPoints={totalPoints} />

            {/* Mood Tracker */}
            <MoodTracker onMoodSelect={handleMoodSelect} todayMood={todayMood} />
          </div>

          {/* Right Column - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-5">

          {/* Girl Math */}
          {/* <GirlMath completedHabits={completedHabits} goals={goals} /> */}

          {/* Daily Goals */}
          <Habits
            completedHabits={habits.daily.completed}
            onToggle={toggleDailyHabit}
            customHabits={habits.daily.custom}
            onAddCustom={addDailyCustomHabit}
            title="Daily Goals"
          />

          {/* Weekly Goals */}
          <Habits
            completedHabits={habits.weekly.completed}
            onToggle={toggleWeeklyHabit}
            customHabits={habits.weekly.custom}
            onAddCustom={addWeeklyCustomHabit}
            title="Weekly Goals"
          />

          {/* Monthly Goals */}
          <Habits
            completedHabits={habits.monthly.completed}
            onToggle={toggleMonthlyHabit}
            customHabits={habits.monthly.custom}
            onAddCustom={addMonthlyCustomHabit}
            title="Monthly Goals"
          />

          {/* Goals
          <Goals
            goals={goals}
            onAddGoal={addGoal}
            onCompleteGoal={completeGoal}
          /> */}

          {/* Reflection */}
          <Reflection
            completedHabits={allCompletedHabits}
            goals={[]}
            companionType={companionType}
            companionStage={companionStage}
          />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-4 pb-2">
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            SAGE · Trauma-informed wellness · No streaks, no shame 💚
          </p>
        </footer>
      </main>
    </div>
  );
}
