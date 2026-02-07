import React, { useState } from 'react';

export default function MoodTracker({ onMoodSelect, todayMood }) {
  const [selectedMood, setSelectedMood] = useState(todayMood || null);
  const [isAnimating, setIsAnimating] = useState(false);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#FBBF24' },
    { id: 'mid', emoji: '😐', label: 'Okay', color: '#A78BFA' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#60A5FA' },
    { id: 'mad', emoji: '😠', label: 'Mad', color: '#F472B6' },
  ];

  const handleMoodClick = (moodId) => {
    if (selectedMood === moodId) return; // Already selected

    setSelectedMood(moodId);
    setIsAnimating(true);

    // Call parent handler to save to Firebase
    onMoodSelect(moodId);

    // Reset animation
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className="rounded-3xl p-6 mt-4"
      style={{
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(119, 154, 119, 0.1)',
      }}
    >
      <div className="text-center mb-4">
        <h3 className="font-display text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          How are you feeling today?
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Track your mood each day
        </p>
      </div>

      {/* Mood options grid */}
      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodClick(mood.id)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-2xl
              transition-all duration-300 hover:scale-105 active:scale-95
              ${selectedMood === mood.id ? 'ring-2' : 'hover:shadow-md'}
            `}
            style={{
              background: selectedMood === mood.id
                ? 'var(--bg-secondary)'
                : 'transparent',
              border: selectedMood === mood.id
                ? `2px solid ${mood.color}`
                : '1px solid rgba(119, 154, 119, 0.1)',
              '--tw-ring-color': mood.color,
            }}
            title={mood.label}
          >
            <span
              className={`text-3xl ${selectedMood === mood.id && isAnimating ? 'animate-bounce-gentle' : ''}`}
            >
              {mood.emoji}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{
                color: selectedMood === mood.id ? mood.color : 'var(--text-muted)'
              }}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Confirmation message */}
      {selectedMood && (
        <div
          className="mt-4 text-center animate-bloom-in"
        >
          <p className="text-xs" style={{ color: 'var(--accent-sage)' }}>
            ✓ Mood logged for today
          </p>
        </div>
      )}
    </div>
  );
}
