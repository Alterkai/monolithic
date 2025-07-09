import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';

// Source Hierarchy: 1. API/Database (logged in), 2. Local Storage
export const useUserMangaStore = defineStore('userManga', {
  state: () => ({
    bookmarks: [] as { manga_id: number, manga_title: string, manga_cover: string, last_read_chapter_id: number }[],
    readingProgress: {} as Record<string, { chapter: number, page: number }>,
  }),

  actions: {
    addBookmark(manga: { id: number, title: string, cover: string }) {
      this.bookmarks.push({
        manga_id: manga.id,
        manga_title: manga.title,
        manga_cover: manga.cover,
        last_read_chapter_id: 0 // Default to 0, can be updated later
      })
    },
    removeBookmark(mangaId: number) {
      this.bookmarks = this.bookmarks.filter(b => b.manga_id !== mangaId);
    },
    
  }
})