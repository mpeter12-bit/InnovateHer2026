import { db } from '../firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Save entire user profile to Firestore ──
export async function saveUserData(uid, data) {
  try {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving user data:', err);
    return false;
  }
}

// ── Load user profile from Firestore ──
export async function loadUserData(uid) {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error('Error loading user data:', err);
    return null;
  }
}

// ── Create new user profile ──
export async function createUserProfile(uid, email) {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    // Only create if doesn't exist (returning user keeps their data)
    if (!snap.exists()) {
      await setDoc(ref, {
        email,
        companionType: null,
        completedHabits: [],
        customHabits: [],
        goals: [],
        totalPoints: 0,
        theme: 'warm',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return true;
  } catch (err) {
    console.error('Error creating user profile:', err);
    return false;
  }
}

// ── Update a single field ──
export async function updateUserField(uid, field, value) {
  try {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, {
      [field]: value,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error(`Error updating ${field}:`, err);
    return false;
  }
}
