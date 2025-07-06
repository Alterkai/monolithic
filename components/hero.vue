<template >
  <UCarousel :autoplay="{ delay: 5000 }" :items="data" v-slot="{ item }" :ui="{ item: height }" class="w-full overflow-hidden">
    <div class="h-full">
      <NuxtImg :src="item.manga_cover" class="absolute inset-0 w-full h-full object-cover -z-10" alt="Hero background" />

      <!-- Gradient Overlay for Readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <!-- Main Content -->
      <div class="relative z-10 h-full flex flex-col justify-end">
        <div class="container w-full p-4 md:p-6">
          <div class="flex flex-col md:flex-row items-stretch gap-0">

            <!-- Left Section: Title & Genres -->
            <div
              class="bg-black/50 backdrop-blur-sm p-4 md:p-6 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-[65%] flex flex-col justify-center">
              <h1 class="text-white text-2xl min-md:text-3xl font-bold line-clamp-2 leading-tight">
                {{ item.manga_title }}
              </h1>
              <div class="flex flex-row flex-wrap gap-2 mt-3">
                <div v-for="genre in item.genres" :key="genre.id" class="text-white bg-white/20 px-2 py-1 text-xs rounded">
                  {{ capitalizeEachWord(genre.name) }}
                </div>
              </div>
            </div>

            <!-- Right Section: Chapter & CTA Button -->
            <div
              class="bg-primary p-4 md:p-6 text-slate-950 rounded-b-lg md:rounded-r-lg md:rounded-bl-none flex items-center justify-between w-full md:w-auto">
              <div class="text-center max-md:text-left">
                <p class="font-bold text-2xl md:text-3xl">#54</p>
                <p class="text-xs font-semibold uppercase">Latest Chapter</p>
              </div>
              <NuxtLink :to="`/manga/30`" class="ml-4">
                <UButton icon="i-lucide-book-open" size="lg" color="neutral" variant="solid">
                  Read Now
                </UButton>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
import { capitalizeEachWord } from '~/server/utils/capitalizeEachWord';
interface Genre {
  id: number;
  name: string;
}

interface CarouselItem {
  manga_title: string;
  manga_description: string;
  manga_cover: string;
  genres: Genre[];
}

defineProps<{
  data: CarouselItem[],
  height?: string;
}>()
</script>