import React, { useState } from 'react';
import { DEFAULT_HABITS } from '../utils/helpers.js';

export default function Habits({ completedHabits, onToggle, customHabits, onAddCustom, title }) {
  const [newHabit, setNewHabit] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [habitCounts, setHabitCounts] = useState({});
  const [habitEmojis, setHabitEmojis] = useState({}); // Track emoji overrides

  // Build emoji options: include all default habit emojis + custom ones
  const getEmojiOptions = () => {
    const defaultEmojis = DEFAULT_HABITS.map((h) => h.emoji);
    const customEmojis = ['☀️', '🌸', '✨', '💫', '🦋', '🌈', '🌺', '🎀', '💐', '🌻'];
    // Combine and remove duplicates
    return [...new Set([...defaultEmojis, ...customEmojis])];
  };

  const EMOJI_OPTIONS = getEmojiOptions();

  //const allHabits = [...DEFAULT_HABITS, ...customHabits];
  const allHabits = [...customHabits];

  const handleAdd = () => {
    const label = newHabit.trim();
    if (!label) return;
    onAddCustom({
      id: `custom_${Date.now()}`,
      label,
      emoji: '🌟',
      //points: 1,
    });
    setNewHabit('');
    setShowAdd(false);
  };

  const incrementCount = (habitId) => {
    setHabitCounts((prev) => ({
      ...prev,
      [habitId]: (prev[habitId] || 0) + 1,
    }));
  };

  const decrementCount = (habitId) => {
    setHabitCounts((prev) => ({
      ...prev,
      [habitId]: Math.max(0, (prev[habitId] || 0) - 1),
    }));
  };

  const cycleEmoji = (habitId, currentEmoji) => {
    const currentIndex = EMOJI_OPTIONS.indexOf(currentEmoji);
    const nextIndex = (currentIndex + 1) % EMOJI_OPTIONS.length;
    const newEmoji = EMOJI_OPTIONS[nextIndex];
    
    setHabitEmojis((prev) => ({
      ...prev,
      [habitId]: newEmoji,
    }));

    // If it's a custom habit, update via parent
    if (onUpdateHabitEmoji) {
      onUpdateHabitEmoji(habitId, newEmoji);
    }
  };

  const isCustomHabit = (habitId) => habitId.startsWith('custom_');

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(119, 154, 119, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
          {title} ☁️
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          {completedHabits.length}/{allHabits.length}
        </span>
      </div>

      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        No pressure — check off whatever feels right today.
      </p>

      <div className="space-y-2">
        {allHabits.map((habit) => {
          const isChecked = completedHabits.includes(habit.id);
          const count = habitCounts[habit.id] || 0;
          const custom = isCustomHabit(habit.id);
          // Use overridden emoji if it exists, otherwise use habit's emoji
          const displayEmoji = habitEmojis[habit.id] || habit.emoji;

          return (
            <label
              key={habit.id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isChecked ? 'scale-[0.98]' : 'hover:scale-[1.01]'
              }`}
              style={{
                background: isChecked ? 'var(--bg-secondary)' : 'transparent',
                opacity: isChecked ? 0.75 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(habit.id)}
                className="rounded"
              />

              {/* Clickable emoji */}
              <button
                onClick={() => cycleEmoji(habit.id, displayEmoji)}
                className="text-lg transition-all hover:scale-125 active:scale-100 cursor-pointer"
                title="Click to cycle emoji"
              >
                {displayEmoji}
              </button>

              <span
                className={`text-sm font-body flex-1 ${isChecked ? 'line-through' : ''}`}
                style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}
              >
                {habit.label}
              </span>



              {/* Counter with minus and plus buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementCount(habit.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-medium transition-all hover:scale-110"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(119, 154, 119, 0.2)',
                  }}
                >
                  −
                </button>
                <span
                  className="w-6 text-center text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {count}
                </span>
                <button
                  onClick={() => incrementCount(habit.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-medium transition-all hover:scale-110"
                  style={{
                    background: 'var(--accent-sage)',
                    color: 'white',
                    border: '1px solid rgba(119, 154, 119, 0.3)',
                  }}
                >
                  +
                </button>
              </div>
              {/*}
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                +{habit.points} pts
              </span> */}

              {/* Delete button - only for custom habits 
              {custom && (
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="ml-1 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                  style={{
                    color: '#d97706',
                    background: 'rgba(217, 119, 6, 0.1)',
                  }}
                  title="Delete habit"
                >
                  🗑️
                </button>
              )} */}

            </label>
          );
        })}
      </div>


      {/* Add custom habit */}
      <div className="mt-4">
        {showAdd ? (
          <div className="flex gap-2 animate-bloom-in">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add a gentle habit..."
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(119, 154, 119, 0.15)',
                '--tw-ring-color': 'var(--accent-sage)',
              }}
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--accent-sage)' }}
            >
              Add
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewHabit(''); }}
              className="px-3 py-2 rounded-xl text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
            style={{
              border: '1px dashed var(--text-muted)',
              color: 'var(--text-secondary)',
              background: 'transparent',
            }}
          >
            + Add your own habit
          </button>
        )}
      </div>
    </div>
  );
}
