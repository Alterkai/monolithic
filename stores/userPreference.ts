import { defineStore } from 'pinia';

export const useUserPreference = defineStore('userPreference', {
  state: () => ({
    // Reading View Preference
    isLongstrip: false,
  }),

  actions: {
    setViewMode(isLongstrip: boolean) {
      this.isLongstrip = isLongstrip;
    },
    toggleViewMode() {
      this.isLongstrip = !this.isLongstrip;
    }
  },

  getters: {
    getViewMode: (state) => {
      return state.isLongstrip;
    }
  },
  
  persist: true,
})