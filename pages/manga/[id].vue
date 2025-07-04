<template>
  <!-- BACK IMAGE -->
  <div class="h-[20rem] overflow-hidden -z-10 relative">
    <NuxtImg ref="parallaxImage" v-slot="{ src, isLoaded }"
      class="w-full object-cover opacity-30 blur-sm select-none inset-0" :src="mangaDetails?.cover"
      :style="{ transform: `translateY(${parallaxOffset}px)` }" draggable="false">
      <!-- Loaded image -->
      <img v-if="isLoaded" :src="src" style="z-index: -10" />
      <!-- Placeholder -->
      <USkeleton v-else />
    </NuxtImg>
  </div>

  <div class="container flex -mt-16 z-10">
    <div v-if="mangaDetails" class="flex flex-col min-md:flex-row gap-5">
      <!-- Cover -->
      <NuxtImg :src="mangaDetails.cover" class="min-md:h-[20rem]" style="width: auto" />
      <!-- Content -->
      <div class="flex flex-col gap-2">
        <h1 class="font-bold text-3xl">{{ mangaDetails.title }}</h1>
        <h2 class="text-lg">{{ mangaDetails.original_title }}</h2>

        <USeparator type="solid" color="primary" />

        <!-- STATUS -->
        <div class="flex flex-row gap-4 font-semibold">
          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-eye" class="size-5" />
            <span class="text-sm">x Views</span>
          </div>

          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-star" class="size-5" />
            <span class="text-sm">{{ mangaDetails.ratings }}</span>
          </div>
        </div>

        <!-- DESCRIPTIONS -->
        <p class="text-md text-neutral">{{ mangaDetails.description }}</p>

        <!-- AUTHOR -->
        <span class="text-md">Author: {{ mangaDetails.author }}</span>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-row gap-2 mt-2">
          <UButton color="primary" icon="i-lucide-book-open" size="xl">
            Read
          </UButton>

          <UButton color="secondary" icon="i-lucide-bookmark" size="xl" />
        </div>

        <!-- GENRES -->
        <div class="flex flex-row gap-2 mt-4">
          <span v-for="genre in mangaDetails.genre" class="font-semibold text-sm">
            <span v-if="genre == 'yuri'" class="bg-primary p-1 px-1.5 rounded-sm text-white">{{ capitalizeEachWord(genre) }}</span>
            <span v-else class="p-1 px-1.5 outline outline-current rounded-sm">{{ capitalizeEachWord(genre)
              }}</span>
          </span>
        </div>

        <div class="" v-for="chapter in mangaDetails.chapters">
          {{ chapter.number }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import type { Chapter } from '@/types/database'
import { capitalizeEachWord } from '@/server/utils/capitalizeEachWord'

const route = useRoute();
const toast = useToast();
const parallaxOffset = ref(0);
const parallaxImage = ref(null);

interface MangaDetail {
  id: number,
  title: string,
  original_title: string,
  description: string,
  cover: string,
  ratings: number,
  genre: string[],
  chapters: Chapter[],
  author: string,
}

const handleScroll = () => {
  if (parallaxImage.value) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    parallaxOffset.value = rate;
  }
}

let mangaDetails = ref<MangaDetail | null>(null);
// Fetch manga details
async function fetchMangaDetails() {
  try {
    const results = await $fetch<MangaDetail>(`/api/manga/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    mangaDetails.value = results;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to fetch manga details.',
      color: 'error',
      duration: 5000
    });
  }
}

onMounted(() => {
  fetchMangaDetails();
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>