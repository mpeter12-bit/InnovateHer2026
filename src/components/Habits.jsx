import React, { useState } from 'react';
import { DEFAULT_HABITS } from '../utils/helpers.js';

export default function Habits({ completedHabits, onToggle, customHabits, onAddCustom, onEditCustom, onDeleteCustom, habitCounts, setHabitCounts, title, titledesc }) {
  const [newHabit, setNewHabit] = useState('');
  const [newGoalFrequency, setNewGoalFrequency] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  // Editing state
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editedLabel, setEditedLabel] = useState('');
  const [editedGoalFrequency, setEditedGoalFrequency] = useState(1);

  // Auto-check/uncheck when count reaches/drops below goal
  React.useEffect(() => {
    if (!habitCounts) return; // Guard against undefined

    customHabits.forEach(habit => {
      const count = habitCounts[habit.id] || 0;
      const goal = Number(habit.goalFrequency) || 1;
      const isChecked = completedHabits.includes(habit.id);

      // Auto-check if we reached the goal
      if (count >= goal && !isChecked) {
        onToggle(habit.id);
      }
      // Auto-uncheck if we dropped below the goal
      else if (count < goal && isChecked) {
        onToggle(habit.id);
      }
    });
  }, [habitCounts, customHabits, completedHabits, onToggle]);

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
      goalFrequency: newGoalFrequency || 1,
    });
    setNewHabit('');
    setNewGoalFrequency(1);
    setShowAdd(false);
  };

  const incrementCount = (habitId, goalFrequency) => {
    setHabitCounts((prev) => ({
      ...(prev || {}),
      [habitId]: ((prev && prev[habitId]) || 0) + 1,
    }));
  };

  const decrementCount = (habitId, goalFrequency) => {
    setHabitCounts((prev) => ({
      ...(prev || {}),
      [habitId]: Math.max(0, ((prev && prev[habitId]) || 0) - 1),
    }));
  };

  const cycleEmoji = (habitId, currentEmoji) => {
    const currentIndex = EMOJI_OPTIONS.indexOf(currentEmoji);
    const nextIndex = (currentIndex + 1) % EMOJI_OPTIONS.length;
    const newEmoji = EMOJI_OPTIONS[nextIndex];

    // Save emoji to habit object so it persists
    onEditCustom(habitId, { emoji: newEmoji });
  };

  const isCustomHabit = (habitId) => habitId.startsWith('custom_');

  // Start editing a habit
  const startEdit = (habit) => {
    setEditingHabitId(habit.id);
    setEditedLabel(habit.label);
    setEditedGoalFrequency(habit.goalFrequency || 1);
  };

  // Save edited habit
  const saveEdit = (habitId) => {
    if (!editedLabel.trim()) return;
    onEditCustom(habitId, {
      label: editedLabel.trim(),
      goalFrequency: editedGoalFrequency || 1,
    });
    setEditingHabitId(null);
    setEditedLabel('');
    setEditedGoalFrequency(1);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingHabitId(null);
    setEditedLabel('');
    setEditedGoalFrequency(1);
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
          {title} ☁️
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          {completedHabits.length}/{allHabits.length}
        </span>
      </div>

      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {titledesc}
      </p>

      <div className="space-y-2">
        {allHabits.map((habit) => {
          const isChecked = completedHabits.includes(habit.id);
          const count = (habitCounts && habitCounts[habit.id]) || 0;
          const custom = isCustomHabit(habit.id);
          const displayEmoji = habit.emoji;
          const isEditing = editingHabitId === habit.id;

          // If editing this habit, show edit UI
          if (isEditing) {
            return (
              <div
                key={habit.id}
                className="flex items-center gap-2 p-3 rounded-xl animate-bloom-in"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(119, 154, 119, 0.2)',
                }}
              >
                <input
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(habit.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 px-2 py-1 rounded-lg text-sm outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(119, 154, 119, 0.15)',
                    '--tw-ring-color': 'var(--accent-sage)',
                  }}
                  autoFocus
                  placeholder="Habit name"
                />
                <input
                  type="number"
                  value={editedGoalFrequency}
                  onChange={(e) => setEditedGoalFrequency(Math.max(1, parseInt(e.target.value) || 1))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(habit.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="w-16 px-2 py-1 rounded-lg text-sm text-center outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(119, 154, 119, 0.15)',
                    '--tw-ring-color': 'var(--accent-sage)',
                  }}
                  min="1"
                  placeholder="Goal"
                />
                <button
                  onClick={() => saveEdit(habit.id)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'var(--accent-sage)', color: 'white' }}
                  title="Save"
                >
                  ✓
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            );
          }

          // Normal display
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isChecked ? 'scale-[0.98]' : 'hover:scale-[1.01]'
              }`}
              style={{
                background: isChecked ? 'var(--bg-secondary)' : 'transparent',
                opacity: isChecked ? 0.75 : 1,
              }}
            >
              <div className="flex">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(habit.id)}
                  className="rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-col justify-between w-[100%] gap-2 sm:flex-row">
                <div>


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
                </div>
                <div className="flex gap-1">
                {/* Counter with minus and plus buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementCount(habit.id, habit.goalFrequency || 1)}
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
                    className="min-w-[40px] text-center text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {count}/{habit.goalFrequency || 1}
                  </span>
                  <button
                    onClick={() => incrementCount(habit.id, habit.goalFrequency || 1)}
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

                {/* Edit/Delete buttons - only for custom habits */}
                {custom && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(habit)}
                      className="p-1.5 rounded-md text-xs transition-all hover:scale-110"
                      style={{
                        color: 'var(--accent-sage)',
                        background: 'rgba(119, 154, 119, 0.1)',
                      }}
                      title="Edit habit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteCustom(habit.id)}
                      className="p-1.5 rounded-md text-xs transition-all hover:scale-110"
                      style={{
                        color: '#d97706',
                        background: 'rgba(217, 119, 6, 0.1)',
                      }}
                      title="Delete habit"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                </div>
                </div>
            </div>
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
            <input
              type="number"
              value={newGoalFrequency}
              onChange={(e) => setNewGoalFrequency(Math.max(1, parseInt(e.target.value) || 1))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Goal"
              className="w-20 px-3 py-2 rounded-xl text-sm text-center outline-none focus:ring-2"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(119, 154, 119, 0.15)',
                '--tw-ring-color': 'var(--accent-sage)',
              }}
              min="1"
              title="How many times?"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--accent-sage)' }}
            >
              Add
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewHabit(''); setNewGoalFrequency(1); }}
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
