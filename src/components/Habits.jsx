import React, { useState } from 'react';
import { DEFAULT_HABITS } from '../utils/helpers.js';

export default function Habits({ completedHabits, onToggle, customHabits, onAddCustom }) {
  const [newHabit, setNewHabit] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const allHabits = [...DEFAULT_HABITS, ...customHabits];

  const handleAdd = () => {
    const label = newHabit.trim();
    if (!label) return;
    onAddCustom({
      id: `custom_${Date.now()}`,
      label,
      emoji: '🌟',
      points: 1,
    });
    setNewHabit('');
    setShowAdd(false);
  };

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
          Today's Care ☁️
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
              <span className="text-lg">{habit.emoji}</span>
              <span
                className={`text-sm font-body flex-1 ${isChecked ? 'line-through' : ''}`}
                style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}
              >
                {habit.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                +{habit.points} pts
              </span>
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
