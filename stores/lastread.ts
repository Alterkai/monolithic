import { defineStore } from "pinia";

export const useLastReadStore = defineStore("lastread", {
  state: () => ({
    lastRead: {} as Record<number, number>,
  }),

  actions: {
    setLastRead(mangaId: number, chapterId: number) {
      this.lastRead[mangaId] = chapterId;
    },
    getLastRead(mangaId: number): number {
      return this.lastRead[mangaId] || 1;
    },
  },

  persist: true,
});
