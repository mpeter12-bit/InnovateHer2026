import React, { useState } from 'react';
import { auth } from '../firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      setAnimating(true);
      setTimeout(() => onLogin(userCredential.user), 600);
    } catch (err) {
      const messages = {
        'auth/user-not-found': "No account found — try signing up!",
        'auth/wrong-password': "Incorrect password — try again.",
        'auth/invalid-credential': "Incorrect email or password — try again, or sign up.",
        'auth/email-already-in-use': "This email already has an account — try logging in.",
        'auth/weak-password': "Password needs at least 6 characters.",
        'auth/invalid-email': "Please enter a valid email address.",
        'auth/too-many-requests': "Too many attempts — take a breath and try again shortly. 💚",
      };
      setError(messages[err.code] || "Something went wrong — please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className={`w-full max-w-sm transition-all duration-700 ${animating ? 'scale-95 opacity-0' : 'animate-bloom-in'}`}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-float">🌸</div>
          <h1 className="font-display text-4xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            HabitBloom
          </h1>
          <p className="mt-2 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
            Gentle growth, one small step at a time
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-3xl p-8 backdrop-blur-sm"
          style={{
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-soft)',
            border: '1px solid rgba(119, 154, 119, 0.1)',
          }}
        >
          <h2 className="font-display text-xl font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            {isSignUp ? 'Create your space' : 'Welcome back'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Sign up to save your progress across devices.' : 'Log in to continue your journey.'}
          </p>

          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-sm animate-bloom-in"
              style={{
                background: 'rgba(244, 114, 182, 0.08)',
                color: 'var(--accent-bloom)',
                border: '1px solid rgba(244, 114, 182, 0.15)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none focus:ring-2"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(119, 154, 119, 0.15)',
                  '--tw-ring-color': 'var(--accent-sage)',
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl text-sm font-body transition-all duration-200 outline-none focus:ring-2"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(119, 154, 119, 0.15)',
                  '--tw-ring-color': 'var(--accent-sage)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--accent-sage), var(--accent-bloom))',
                boxShadow: '0 4px 16px rgba(119, 154, 119, 0.2)',
              }}
            >
              {loading ? '🌸 One moment...' : isSignUp ? 'Create Account 🌱' : 'Log In 🌱'}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="w-full mt-3 py-2 text-sm font-medium transition-all duration-200"
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          Your progress is saved securely in the cloud. 💚
        </p>
      </div>
    </div>
  );
}
