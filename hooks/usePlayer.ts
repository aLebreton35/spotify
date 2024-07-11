import { create } from 'zustand';

interface PlayerStore {
  ids: string[];
  activeId?: string;
  shuffledIds: string[];
  isShuffling: boolean;
  isLooping: boolean;
  progress: number;
  duration: number;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  updateProgress: (currentTime: number, duration: number) => void;
}

export const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  shuffledIds: [],
  isShuffling: false,
  isLooping: false,
  progress: 0,
  duration: 0,

  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids, shuffledIds: ids.slice().sort(() => Math.random() - 0.5) }),
  reset: () => set({ ids: [], activeId: undefined, shuffledIds: [], isShuffling: false, isLooping: false, progress: 0, duration: 0 }),
  toggleShuffle: () => set((state) => ({
    isShuffling: !state.isShuffling,
    shuffledIds: !state.isShuffling ? state.ids.slice().sort(() => Math.random() - 0.5) : state.ids,
  })),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  updateProgress: (currentTime: number, duration: number) => set({ progress: currentTime, duration }),
}));
