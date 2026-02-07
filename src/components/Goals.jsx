import React, { useState } from 'react';

export default function Goals({ goals, onAddGoal, onCompleteGoal }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [target, setTarget] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddGoal({
      id: `goal_${Date.now()}`,
      name: name.trim(),
      unitValue: parseFloat(unitValue) || 0,
      target: parseFloat(target) || 100,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setName('');
    setUnitValue('');
    setTarget('');
    setShowForm(false);
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(119, 154, 119, 0.1)',
      }}
    >
      <h2 className="font-display text-xl font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        Your Goals 🎯
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Set intentions — no deadlines, just directions.
      </p>

      {/* Active goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-3 mb-4">
          {activeGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-xl"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {goal.name}
                  </h4>
                  {goal.unitValue > 0 && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Each habit = {goal.unitValue} unit{goal.unitValue !== 1 ? 's' : ''} toward {goal.target}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onCompleteGoal(goal.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                  style={{
                    background: 'var(--accent-sage)',
                    color: 'white',
                  }}
                >
                  Done ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Achieved 🌸
          </p>
          <div className="space-y-1">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-2 py-1">
                <span className="text-sm">✅</span>
                <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                  {goal.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add goal form */}
      {showForm ? (
        <div className="space-y-3 animate-bloom-in">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., "Save $50" or "Exercise 3x/week"'
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(119, 154, 119, 0.15)',
              '--tw-ring-color': 'var(--accent-sage)',
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Unit per habit
              </label>
              <input
                type="number"
                value={unitValue}
                onChange={(e) => setUnitValue(e.target.value)}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(119, 154, 119, 0.15)',
                  '--tw-ring-color': 'var(--accent-sage)',
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Target total
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(119, 154, 119, 0.15)',
                  '--tw-ring-color': 'var(--accent-sage)',
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--accent-sage)' }}
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
          style={{
            border: '1px dashed var(--text-muted)',
            color: 'var(--text-secondary)',
            background: 'transparent',
          }}
        >
          + Set a new goal
        </button>
      )}
    </div>
  );
}
