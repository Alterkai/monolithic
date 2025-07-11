<template>
  <!-- HERO SECTION -->
  <div v-if="pending">
    <USkeleton class="h-[20rem] w-full" />
  </div>
  <div v-else-if="data?.dailyHighlights">
    <Hero :data="data.dailyHighlights" :height="'h-[20rem]'" />
  </div>

  <div class="container flex flex-row mt-5 gap-5 max-lg:flex-col">
    <!-- PROJECTS TITLE/CARDS -->
    <div class="flex flex-col w-auto max-lg:w-full">
      <h2 class="font-semibold text-2xl mb-5">Latest Projects</h2>
      <div v-if="pending">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-6">
          <div v-for="i in 10" :key="i" class="flex flex-col gap-2">
            <USkeleton class="h-[250px] w-full" />
            <USkeleton class="h-4 w-3/4" />
          </div>
        </div>
      </div>

      <div v-else-if="data?.latestManga">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-6">
          <NuxtLink v-for="manga in data.latestManga" :key="manga.manga_id" :to="`/manga/${manga.manga_id}`">
            <MangacardHome :data="manga" />
          </NuxtLink>
        </div>
      </div>
      <div v-else-if="error">
        <p>Could not load latest projects. Please try again later.</p>
      </div>
    </div>

    <!-- SOCIAL MEDIA -->
    <div class="min-lg:w-[40%]">
      <h2 class="font-semibold text-2xl">Social Media</h2>
      awda
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();

interface LatestManga {
  manga_id: number;
  manga_title: string;
  manga_cover: string;
  chapter_number: number;
  chapter_name: string;
  chapter_date_added: Date;
}

interface HomePageData {
  latestManga: LatestManga[];
  dailyHighlights: any[];
}

const { data, pending, error } = await useAsyncData<HomePageData>(
  'home-page-data',
  async () => {
    // Fetch both endpoints concurrently for better performance
    const [latestManga, dailyHighlights] = await Promise.all([
      $fetch<LatestManga[]>('/api/manga/latest-chapters'),
      $fetch<LatestManga[]>('/api/manga/daily-highlights')
    ]);
    return { latestManga, dailyHighlights };
  }
);

if (error.value) {
  console.error(error.value);
  toast.add({
    title: 'Error Fetching Data',
    description: 'Could not load data for the home page. Please try refreshing.',
    color: 'error',
    duration: 5000
  });
}
</script>