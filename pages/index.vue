<template>
  <!-- HERO SECTION -->
  <div>
    <Hero :data="dailyHighlights" :height="'h-[20rem]'" />
  </div>

  <div class="container flex flex-row mt-5 gap-5 max-lg:flex-col">
    <!-- PROJECTS TITLE/CARDS -->
    <div class="flex flex-col w-auto max-lg:w-full">
      <h2 class="font-semibold text-2xl mb-5">Latest Projects</h2>
      <div v-if="isLoading">
        <USkeleton />
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-6">
          <NuxtLink v-for="manga in latestManga" :key="manga.manga_id" :to="`/manga/${manga.manga_id}`">
            <MangacardHome :data="manga" />
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- SOCIAL MEDIA -->
    <div class="">
      <h2 class="font-semibold text-2xl">Social Media</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const isLoading = ref(false);

interface LatestManga {
  manga_id: number;
  manga_title: string;
  manga_cover: string;
  chapter_number: number;
  chapter_name: string;
  chapter_date_added: Date;
}

let latestManga = ref<LatestManga[]>([]);
async function fetchLatestManga() {
  try {
    isLoading.value = true;
    const response = await $fetch<LatestManga[]>('/api/manga/latest-chapters', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    latestManga.value = response;
  } catch (error) {
    console.error(error);
    toast.add({
      title: 'Error',
      description: 'Failed to fetch latest manga.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

let dailyHighlights = ref([]);
async function fetchDailyHighlights() {
  try {
    isLoading.value = true;
    const response = await $fetch<[]>('/api/manga/daily-highlights', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    dailyHighlights.value = response;
  } catch (error) {
    console.error(error);
    toast.add({
      title: 'Error',
      description: 'Failed to fetch daily highlights.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchLatestManga();
  fetchDailyHighlights();
})
</script>