import React, { useState } from 'react';
import { getActivityLevel } from '../utils/helpers.js';

export default function Reflection({ completedHabits, goals, companionType, companionStage }) {
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReflection = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedHabits,
          activityLevel: getActivityLevel(completedHabits.length),
          goalsCompleted: goals.filter((g) => g.completed).map((g) => g.name),
          companionType,
          companionStage,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReflection(data.reflection);
    } catch (err) {
      // Use fallback messages
      const fallbacks = [
        "You're showing up in your own way today — that counts!",
        "Small acts of care are meaningful — keep going.",
        "Your companion is grateful for your presence, however it looks today.",
        "There's no wrong way to take care of yourself. You're doing it.",
        "Every gentle moment you give yourself matters more than you know.",
      ];
      const postAdultFallbacks = [
        "Your companion is fully grown, but your habits continue to nourish your wellbeing.",
        "Even though your companion is mature, your care continues to make a difference.",
        "A fully bloomed companion still needs your light — and so do you.",
      ];
      const pool = companionStage === 'adult' ? [...fallbacks, ...postAdultFallbacks] : fallbacks;
      setReflection(pool[Math.floor(Math.random() * pool.length)]);
    } finally {
      setLoading(false);
    }
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
      <h2 className="font-display text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Gentle Reflection 🪷
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        A kind word, just for you. No judgment, ever.
      </p>

      {reflection && (
        <div
          className="p-5 rounded-2xl mb-4 animate-bloom-in"
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary), rgba(244, 114, 182, 0.05))',
            border: '1px solid rgba(119, 154, 119, 0.1)',
          }}
        >
          <p className="text-sm leading-relaxed font-body italic" style={{ color: 'var(--text-primary)' }}>
            "{reflection}"
          </p>
          <p className="text-[10px] mt-3" style={{ color: 'var(--text-muted)' }}>
            — Your SAGE companion 🌸
          </p>
        </div>
      )}

      <button
        onClick={fetchReflection}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
        style={{
          background: loading ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent-sage), var(--accent-bloom))',
          color: loading ? 'var(--text-secondary)' : 'white',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(119, 154, 119, 0.15)',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin text-base">🌸</span>
            Thinking kindly...
          </span>
        ) : reflection ? (
          'Get Another Reflection ✨'
        ) : (
          'Get Reflection 🪷'
        )}
      </button>
    </div>
  );
}
