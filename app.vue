<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup>
import apiClient from '~/utils/apiClient';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isLoggedIn) {
    try {
      const response = await apiClient.auth.me();
      // Update user info if needed
      if (response.user) {
        authStore.setUser(response.user);
      }
    } catch (error) {
      authStore.logOut();
    }
  }
})
</script>