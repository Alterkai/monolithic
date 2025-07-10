<template>
  <UApp>
    <Navbar v-if="!['/login', '/register'].includes(route.path)" />
    <NuxtPage />
    <Footer v-if="!['/login', '/register'].includes(route.path)" class="mt-[10rem]" />
  </UApp>
</template>

<script setup>
const route = useRoute();
</script>