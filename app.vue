<template>
  <UApp>
    <Navbar v-if="!['/login', '/register'].includes(route.path)" />
    <NuxtPage />
    <Footer v-if="!['/login', '/register'].includes(route.path)" />
  </UApp>
</template>

<script setup>
const route = useRoute();
</script>