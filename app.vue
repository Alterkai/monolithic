<template>
  <UApp>
    <Navbar v-if="!['/login', '/register'].includes(route.path)" />
    <NuxtPage />
    <Footer v-if="!['/login', '/register'].includes(route.path)" class="mt-[10rem]" />
  </UApp>
</template>

<script setup>
const route = useRoute();
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