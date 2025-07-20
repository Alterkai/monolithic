<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup>
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isLoggedIn) {
    try {
      await $fetch('/api/auth/me', {
        method: 'GET'
      })
    } catch (error) {
      authStore.logOut();
    }
  }
})
</script>