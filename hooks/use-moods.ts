/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

export type Mood = 'increible' | 'bien' | 'normal' | 'mal' | 'horrible';
export type Energy = 'baja' | 'media' | 'alta';

export interface MoodEntry {
  emoji: Mood;
  note: string;
  energy: Energy;
  word: string;
  timestamp: number;
}

export function useMoods() {
  const [moods, setMoods] = useState<Record<string, MoodEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mood-tracker-data');
    if (saved) {
      try {
        setMoods(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing moods from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveMood = (date: string, entry: MoodEntry) => {
    const newMoods = { ...moods, [date]: entry };
    setMoods(newMoods);
    localStorage.setItem('mood-tracker-data', JSON.stringify(newMoods));
  };

  return { moods, saveMood, isLoaded };
}
