import React, { useState } from 'react';

export default function MoodCalendar({ moodEntries = [] }) {
  // Mood to color mapping
  const moodColors = {
    happy: '#FBBF24',    // yellow
    mid: '#4ADE80',      // green (okay)
    sad: '#60A5FA',      // blue
    mad: '#F472B6',      // light red/pink
  };

  const moodLabels = {
    happy: 'Happy',
    mid: 'Okay',
    sad: 'Sad',
    mad: 'Mad',
  };

  // Get current date for default month/year
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Get first day of month and number of days
  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  // Navigation handlers
  const goToPrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  // Create mood lookup by date
  const moodByDate = {};
  moodEntries.forEach(entry => {
    if (entry.date && entry.mood) {
      moodByDate[entry.date] = entry.mood;
    }
  });

  // Create array of day cells (with empty cells for days before month starts)
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(119, 154, 119, 0.1)',
      }}
    >
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          Mood Calendar
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            title="Previous month"
          >
            ←
          </button>
          <span className="text-sm font-medium w-32 text-center" style={{ color: 'var(--text-primary)' }}>
            {monthNames[displayMonth]} {displayYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            title="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-[11px] font-bold py-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            // Empty cell
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square rounded-lg"
                style={{ background: 'transparent' }}
              />
            );
          }

          // Build date string (YYYY-MM-DD)
          const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const mood = moodByDate[dateStr];
          const moodColor = mood ? moodColors[mood] : null;

          return (
            <div
              key={`day-${day}`}
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all hover:shadow-md hover:scale-105"
              style={{
                background: moodColor || 'var(--bg-secondary)',
                color: moodColor ? 'white' : 'var(--text-primary)',
                border: moodColor ? 'none' : '1px solid rgba(119, 154, 119, 0.2)',
                cursor: 'default',
              }}
              title={mood ? `${moodLabels[mood]} on ${day}` : `No mood logged on ${day}`}
            >
              <span>{day}</span>
              {mood && (
                <span className="text-[16px] mt-0.5" style={{ opacity: 0.9 }}>
                  {mood === 'happy' && '😊'}
                  {mood === 'mid' && '😐'}
                  {mood === 'sad' && '😢'}
                  {mood === 'mad' && '😠'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(119, 154, 119, 0.2)' }}>
        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Mood Legend
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(moodLabels).map(([moodId, label]) => (
            <div key={moodId} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ background: moodColors[moodId] }}
              />
              <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
