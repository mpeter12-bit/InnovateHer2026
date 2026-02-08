import React, { useState, useEffect, useCallback, useRef } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { saveUserData, loadUserData, createUserProfile } from './utils/database.js';
import Login from './components/Login.jsx';
import CompanionChoice from './components/CompanionChoice.jsx';
import Companion from './components/Companion.jsx';
import MoodTracker from './components/MoodTracker.jsx';
import Habits from './components/Habits.jsx';
import GirlMath from './components/GirlMath.jsx';
import Reflection from './components/Reflection.jsx';
import RewardPopup from './components/RewardPopup.jsx';
import { DEFAULT_HABITS, getWeeklyMilestoneReward, getDailyMilestoneReward } from './utils/helpers.js';

export default function App() {
  // ── Auth ──
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // ── App State ──
  const [companionType, setCompanionType] = useState(null);
  const [companionName, setCompanionName] = useState('');
  const [theme, setTheme] = useState('warm');

  // --Newly Added Object Habit States
  const [habits, setHabits] = useState({
    daily: {
      completed: [],
      custom: [],
      counts: {}
    },
    weekly: {
      completed: [],
      custom: [],
      counts: {}
    },
    monthly: {
      completed: [],
      custom: [],
      counts: {}
    },
  })
  /* const [completedHabits, setCompletedHabits] = useState([]);
  const [customHabits, setCustomHabits] = useState([]); */
const [totalPoints, setTotalPoints] = useState(0);
  const getLocalDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [lastDailyReset, setLastDailyReset] = useState(getLocalDate());
  const [moodEntries, setMoodEntries] = useState([]);
  const [rewardPopup, setRewardPopup] = useState(null);
  const prevDailyCountRef = useRef(0);
  const prevWeeklyCountRef = useRef(0);

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
          const loadedHabits = data.habits || {
            daily: { completed: [], custom: [], counts: {} },
            weekly: { completed: [], custom: [], counts: {} },
            monthly: { completed: [], custom: [], counts: {} }
          };

          // Reset daily progress if the date has changed
          const today = getLocalDate();
          const lastDailyReset = data.lastDailyReset || '';
          if (lastDailyReset !== today) {
            loadedHabits.daily = {
              ...loadedHabits.daily,
              completed: [],
              counts: {}
            };
          }

          setHabits(loadedHabits);
          setLastDailyReset(lastDailyReset !== today ? today : lastDailyReset);
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
          daily: { completed: [], custom: [], counts: {} },
          weekly: { completed: [], custom: [], counts: {} },
          monthly: { completed: [], custom: [], counts: {} }
        });
        setTotalPoints(0);
        setLastDailyReset(getLocalDate());
        setTheme('warm');
        setMoodEntries([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const daily = habits.daily.completed.length;
  const weekly = habits.weekly.completed.length;
  const monthly = habits.monthly.completed.length;

  const newTotal = daily + weekly + monthly;

  setTotalPoints(newTotal);
}, [habits]);


  // ── Auto-save to Firestore when state changes (debounced) ──
  useEffect(() => {
    if (!firebaseUser || authLoading || dataLoading) return;

    const timeout = setTimeout(() => {
      saveUserData(firebaseUser.uid, {
        companionType,
        companionName,
        habits,
        totalPoints,
        lastDailyReset,
        theme,
        moodEntries,
        email: firebaseUser.email,
      });
    }, 1000); // Debounce: save 1s after last change

    return () => clearTimeout(timeout);
  }, [companionType, companionName, habits, totalPoints, lastDailyReset, theme, moodEntries, firebaseUser, authLoading, dataLoading]);

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

  // Toggle a daily habit — award/remove a point
  const toggleDailyHabit = (habitId) => {
    setHabits(prev => {
      const wasCompleted = prev.daily.completed.includes(habitId);
      return {
        ...prev,
        daily: {
          ...prev.daily,
          completed: wasCompleted
            ? prev.daily.completed.filter(id => id !== habitId)
            : [...prev.daily.completed, habitId]
        }
      };
    });
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

  const setDailyCounts = (countsOrUpdater) => {
    setHabits(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        counts: typeof countsOrUpdater === 'function'
          ? countsOrUpdater(prev.daily.counts)
          : countsOrUpdater
      }
    }));
  };

  // Toggle a weekly habit — award/remove a point
  const toggleWeeklyHabit = (habitId) => {
    setHabits(prev => {
      const wasCompleted = prev.weekly.completed.includes(habitId);
      return {
        ...prev,
        weekly: {
          ...prev.weekly,
          completed: wasCompleted
            ? prev.weekly.completed.filter(id => id !== habitId)
            : [...prev.weekly.completed, habitId]
        }
      };
    });
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

  const setWeeklyCounts = (countsOrUpdater) => {
    setHabits(prev => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        counts: typeof countsOrUpdater === 'function'
          ? countsOrUpdater(prev.weekly.counts)
          : countsOrUpdater
      }
    }));
  };

  // Toggle a monthly habit — award/remove a point
  const toggleMonthlyHabit = (habitId) => {
    setHabits(prev => {
      const wasCompleted = prev.monthly.completed.includes(habitId);
      return {
        ...prev,
        monthly: {
          ...prev.monthly,
          completed: wasCompleted
            ? prev.monthly.completed.filter(id => id !== habitId)
            : [...prev.monthly.completed, habitId]
        }
      };
    });
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

  const setMonthlyCounts = (countsOrUpdater) => {
    setHabits(prev => ({
      ...prev,
      monthly: {
        ...prev.monthly,
        counts: typeof countsOrUpdater === 'function'
          ? countsOrUpdater(prev.monthly.counts)
          : countsOrUpdater
      }
    }));
  };

  // Edit custom habit
  const editCustomHabit = (category, habitId, updates) => {
    setHabits(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        custom: prev[category].custom.map(h =>
          h.id === habitId ? { ...h, ...updates } : h
        )
      }
    }));
  };

  // Delete custom habit — also removes from completed so the count stays accurate
  const deleteCustomHabit = (category, habitId) => {
    setHabits(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        custom: prev[category].custom.filter(h => h.id !== habitId),
        completed: prev[category].completed.filter(id => id !== habitId),
      }
    }));
  };

  /* const addGoal = (goal) => {
  const handleDeleteHabit = (habitId) => {
    setCustomHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const addGoal = (goal) => {
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

  // Sync refs after data loads so login doesn't trigger milestone popups.
  // This must stay above the milestone effects so it runs first.
  useEffect(() => {
    if (!dataLoading) {
      prevDailyCountRef.current = habits.daily.completed.length;
      prevWeeklyCountRef.current = habits.weekly.completed.length;
    }
  }, [dataLoading]);

  // ── Milestone reward detection ──
  useEffect(() => {
    const dailyCount = habits.daily.completed.length;
    if (dailyCount !== prevDailyCountRef.current) {
      const reward = getDailyMilestoneReward(dailyCount);
      if (reward) setRewardPopup(reward);
      prevDailyCountRef.current = dailyCount;
    }
  }, [habits.daily.completed.length]);

  useEffect(() => {
    const weeklyCount = habits.weekly.completed.length;
    if (weeklyCount !== prevWeeklyCountRef.current) {
      const reward = getWeeklyMilestoneReward(weeklyCount);
      if (reward) setRewardPopup(reward);
      prevWeeklyCountRef.current = weeklyCount;
    }
  }, [habits.weekly.completed.length]);

  // ── Milestone reward popup ──
  const closeRewardPopup = useCallback(() => setRewardPopup(null), []);

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
      {rewardPopup && (
        <RewardPopup
          emoji={rewardPopup.emoji}
          message={rewardPopup.message}
          onClose={closeRewardPopup}
        />
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md px-4 py-3" style={{ background: 'rgba(255, 251, 245, 0.85)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Static on larger screens, stacked on mobile */}
          <div className="w-full md:w-80 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-100px)] md:overflow-y-auto">
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Welcome back, <span className="font-medium">{firebaseUser.email.split('@')[0]}</span> 💚
              </p>
            </div>

            {/* Companion */}
            <Companion type={companionType} totalPoints={totalPoints} companionName={companionName} onRename={setCompanionName} />

            {/* Mood Tracker */}
            <MoodTracker onMoodSelect={handleMoodSelect} todayMood={todayMood} />
          </div>

          {/* Right Column - Scrollable */}
          <div className="flex-1 space-y-5">


          {/* Daily Goals */}
          <Habits
            completedHabits={habits.daily.completed}
            onToggle={toggleDailyHabit}
            customHabits={habits.daily.custom}
            onAddCustom={addDailyCustomHabit}
            onEditCustom={(habitId, updates) => editCustomHabit('daily', habitId, updates)}
            onDeleteCustom={(habitId) => deleteCustomHabit('daily', habitId)}
            habitCounts={habits.daily.counts}
            setHabitCounts={setDailyCounts}
            title="Daily Goals"
          />

          {/* Weekly Goals */}
          <Habits
            completedHabits={habits.weekly.completed}
            onToggle={toggleWeeklyHabit}
            customHabits={habits.weekly.custom}
            onAddCustom={addWeeklyCustomHabit}
            onEditCustom={(habitId, updates) => editCustomHabit('weekly', habitId, updates)}
            onDeleteCustom={(habitId) => deleteCustomHabit('weekly', habitId)}
            habitCounts={habits.weekly.counts}
            setHabitCounts={setWeeklyCounts}
            title="Weekly Goals"
            titledesc="Nurture your growth — weekly intentions for blossoming self-care."
          />

          {/* Monthly Goals */}
          <Habits
            completedHabits={habits.monthly.completed}
            onToggle={toggleMonthlyHabit}
            customHabits={habits.monthly.custom}
            onAddCustom={addMonthlyCustomHabit}
            onEditCustom={(habitId, updates) => editCustomHabit('monthly', habitId, updates)}
            onDeleteCustom={(habitId) => deleteCustomHabit('monthly', habitId)}
            habitCounts={habits.monthly.counts}
            setHabitCounts={setMonthlyCounts}
            title="Monthly Goals"
            titledesc="Cultivate your well-being — monthly milestones for flourishing self-care."
          />

        {/* Girl Math */}
          <GirlMath completedHabits={allCompletedHabits} />

          {/* Reflection */}
          <Reflection
            completedHabits={allCompletedHabits}
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
