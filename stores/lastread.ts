import { defineStore } from "pinia";

export const useLastReadStore = defineStore(
  "lastread",
  () => {
    const lastRead = ref<Record<number, number>>({});

    function setLastRead(mangaId: number, chapterId: number) {
      lastRead.value[mangaId] = chapterId;
    }

    function getLastRead(mangaId: number): number {
      return lastRead.value[mangaId] || 1;
    }

    return {
      lastRead,
      setLastRead,
      getLastRead,
    };
  },
  {
    // @ts-ignore - Pinia persist plugin
    persist: true,
  }
);
