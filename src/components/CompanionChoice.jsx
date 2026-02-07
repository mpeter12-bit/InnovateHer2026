import React, { useState } from 'react';

const companions = [
  {
    type: 'plant',
    emoji: '🌱',
    name: 'Garden Bloom',
    description: 'A gentle plant that grows with your care — from sprout to full bloom.',
    color: 'from-sage-100 to-sage-200',
    accent: 'var(--accent-sage)',
  },
  {
    type: 'animal',
    emoji: '🐱',
    name: 'Cozy Companion',
    description: 'A soft little friend that grows and plays as you nurture your habits.',
    color: 'from-bloom-100 to-petal-100',
    accent: 'var(--accent-bloom)',
  },
];

export default function CompanionChoice({ onChoose }) {
  const [selected, setSelected] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setLeaving(true);
    setTimeout(() => onChoose(selected), 500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${leaving ? 'opacity-0 scale-95' : ''}`}>
      <div className="w-full max-w-md page-enter">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Choose Your Companion
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            They'll grow alongside you as you bloom.
          </p>
        </div>

        <div className="space-y-4">
          {companions.map((c) => (
            <button
              key={c.type}
              onClick={() => setSelected(c.type)}
              className={`w-full p-6 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
                selected === c.type ? 'ring-2 scale-[1.02]' : ''
              }`}
              style={{
                background: 'var(--bg-card)',
                boxShadow: selected === c.type
                  ? `0 8px 32px rgba(119, 154, 119, 0.15)`
                  : 'var(--shadow-soft)',
                border: `1px solid ${selected === c.type ? c.accent : 'rgba(119, 154, 119, 0.1)'}`,
                '--tw-ring-color': c.accent,
              }}
            >
              <div className="flex items-center gap-4">
                <span className={`text-5xl ${selected === c.type ? 'animate-bounce-gentle' : ''}`}>
                  {c.emoji}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                    {c.name}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {c.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <button
            onClick={handleConfirm}
            className="w-full mt-6 py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-bloom-in"
            style={{
              background: 'linear-gradient(135deg, var(--accent-sage), var(--accent-bloom))',
              boxShadow: '0 4px 16px rgba(119, 154, 119, 0.2)',
            }}
          >
            Let's Grow Together 🌿
          </button>
        )}
      </div>
    </div>
  );
}
