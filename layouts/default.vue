<script setup lang="ts">
const route = useRoute();
const showLayout = computed(() => !['/login', '/register'].includes(route.path));
const open = ref(true);

const items = ref([
  {
    icon: 'i-lucide-house',
    label: 'Home',
    to: '/',
  }
])
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-hidden mb-[5rem]">

    <div class="flex flex-row flex-1 overflow-hidden">
      <!-- SIDEBAR NAV -->

      <!-- 1. DESKTOP -->
      <!-- <Sidebar v-if="showLayout" :items="items" class="hidden min-lg:flex w-[17rem] overflow-y-auto flex-shrink-0" /> -->

      <!-- 2. MOBILE -->
      <!-- <USlideover side="left" v-model:open="open" v-if="showLayout">
        <template #content>
          <Sidebar :items="items" class="min-lg:hidden w-full" />
        </template>
      </USlideover> -->

      <div class="overflow-y-auto flex-1">
        <Navbar v-if="showLayout" />

        <slot />
      </div>
    </div>


    <!-- FOOTER -->
    <!-- <Footer v-if="showLayout" /> -->

  </div>
</template>