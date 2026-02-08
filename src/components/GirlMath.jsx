import { generateGirlMath } from '../utils/helpers.js';

export default function GirlMath({ completedHabits }) {
  const messages = generateGirlMath(completedHabits);

  if (messages.length === 0) return null;

  return (
    <div
      className="rounded-3xl p-6 animate-bloom-in"
      style={{
        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(244, 114, 182, 0.15)',
      }}
    >
      <h2 className="font-display text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
        Girl Math 💅✨
      </h2>
      <div className="space-y-2.5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="p-3 rounded-xl text-sm animate-bloom-in"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              animationDelay: `${i * 0.15}s`,
              border: '1px solid rgba(244, 114, 182, 0.08)',
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
