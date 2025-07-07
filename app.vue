<template>
  <UApp>
    <ClientOnly>
      <Navbar v-if="!['/login', '/register'].includes(route.path)" />
    </ClientOnly>
    <NuxtPage />
    <Footer v-if="!['/login', '/register'].includes(route.path)" class="mt-[10rem]" />
  </UApp>
</template>

<script setup>
const route = useRoute();
</script>