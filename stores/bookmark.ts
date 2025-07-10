import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';

// Source Hierarchy: 1. API/Database (logged in), 2. Local Storage
export const useUserMangaStore = defineStore('userManga', {
  state: () => ({
    bookmarks: {} as Record<number, { manga_id: number, manga_title: string, manga_cover: string, last_read_chapter_id: number }>,
    readingProgress: {} as Record<string, { chapter: number, page: number }>,
  }),

  actions: {
    
    
  }
})