import { MoodEntry } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";

const asyncStorageAdapter: PersistStorage<MoodEntry[]> = {
  getItem: (name: string) =>
    AsyncStorage.getItem(name).then((jsonString) => {
      if (jsonString) {
        const data = JSON.parse(jsonString);
        return data;
      }
    }),
  setItem: (name: string, value: StorageValue<MoodEntry[]>) =>
    AsyncStorage.setItem(name, JSON.stringify(value)) as unknown,
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

interface MoodStoreState {
  moodRecords: MoodEntry[];
  addMoodRecord: (record: MoodEntry) => Promise<void>;
  getMoodRecords: () => MoodEntry[];
  clearMoodRecords: () => void;
}

const useMoodStore = create<MoodStoreState>()(
  persist(
    (set, get) => ({
      moodRecords: [],
      addMoodRecord: async (record: MoodEntry) =>
        set((state) => ({
          moodRecords: [...state.moodRecords, record],
        })),
      getMoodRecords: () => get().moodRecords,
      clearMoodRecords: () => set({ moodRecords: [] }),
    }),
    {
      name: "mood-storage",
      storage: asyncStorageAdapter,
    },
  ),
);

export default useMoodStore;
