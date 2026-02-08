import { useMemo } from 'react';

const CONFETTI_COLORS = ['#f472b6', '#86efac', '#fbbf24', '#a78bfa', '#67e8f9', '#fb7185', '#34d399', '#f9a8d4'];

export default function RewardPopup({ emoji, message, onClose }) {
  // Generate confetti pieces once on mount — positions are spread evenly so they cover the popup
  const confetti = useMemo(() => (
    Array.from({ length: 28 }, (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${(i * 3.7) % 100}%`,
      size: 6 + (i % 4) * 3,
      delay: (i % 7) * 0.1,
      duration: 1.5 + (i % 3) * 0.5,
    }))
  ), []);

  return (
    // Clicking the backdrop also closes the popup
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-3xl p-8 mx-4 text-center animate-bloom-in overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          maxWidth: '340px',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti pieces */}
        {confetti.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: p.left,
              top: '-12px',
              animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            }}
          />
        ))}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all hover:scale-110"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
        >
          ✕
        </button>

        {/* Celebratory emoji */}
        <div className="text-6xl mb-4 mt-2">{emoji}</div>

        {/* Reward message */}
        <p className="text-sm leading-relaxed font-body" style={{ color: 'var(--text-primary)' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
