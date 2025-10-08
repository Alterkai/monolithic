import { defineStore } from "pinia";
import apiClient from "~/utils/apiClient";
import type { AuthUser } from "~/types";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const isLoggedIn = ref(false);
    const user = ref<AuthUser | null>(null);

    function setUser(newUser: AuthUser) {
      isLoggedIn.value = true;
      user.value = newUser;
    }

    async function logOut() {
      await apiClient.auth.logout();
      isLoggedIn.value = false;
      user.value = null;
    }

    return {
      isLoggedIn,
      user,
      setUser,
      logOut,
    };
  },
  {
    // @ts-ignore - Pinia persist plugin
    persist: true,
  }
);
