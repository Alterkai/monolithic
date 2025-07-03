import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as { id: string; username: string, isStaff: boolean, roles: string[], avatar: string } | null,
  }),

  actions: {
    setUser(user: { id: string, username: string, isStaff: boolean, roles: string[], avatar: string}) {
      this.isLoggedIn = true;
      this.user = user;
    },
    async logOut() {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      this.isLoggedIn = false;
      this.user = null;
    }
  }
})