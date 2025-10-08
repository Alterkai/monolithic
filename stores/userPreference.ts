import { defineStore } from "pinia";

export const useUserPreference = defineStore(
  "userPreference",
  () => {
    const isLongstrip = ref(false);

    function setViewMode(value: boolean) {
      isLongstrip.value = value;
    }

    function toggleViewMode() {
      isLongstrip.value = !isLongstrip.value;
    }

    const getViewMode = computed(() => isLongstrip.value);

    return {
      isLongstrip,
      setViewMode,
      toggleViewMode,
      getViewMode,
    };
  },
  {
    // @ts-ignore - Pinia persist plugin
    persist: true,
  }
);
