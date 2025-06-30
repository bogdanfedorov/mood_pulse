export type MoodEntry = { date: string; mood: number; comment: string };

export const MOOD_LABELS = [
  { value: 5, emoji: "😄", label: "Very Good" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 1, emoji: "😣", label: "Very Bad" },
];

export const DataUpdateTick = 1000;
