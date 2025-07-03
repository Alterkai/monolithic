<template>
  <div class="container">
    <div v-if="mangaDetails">
      <h1 class="font-bold text-2xl">{{ mangaDetails.title }}</h1>
      <div class="" v-for="chapter in mangaDetails.chapters">
        {{ chapter.number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chapter } from '@/types/database'

const route = useRoute();
const toast = useToast();

interface MangaDetail {
  id: Number,
  title: String,
  original_title: String,
  description: String,
  cover: String,
  ratings: Number,
  genre: String[],
  chapters: Chapter[]
}

let mangaDetails = ref<MangaDetail | null>(null);
// Fetch manga details
async function fetchMangaDetails() {
  try {
    const results = await $fetch < MangaDetail > (`/api/manga/${route.params.id}`, {
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
})
</script>