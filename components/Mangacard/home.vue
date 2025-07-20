<template>
  <!-- Manga Card Container -->
  <div class="w-auto group cursor-pointer flex flex-col rounded-md overflow-hidden dark:outline dark:outline-(--ui-text)/20 light:bg-slate-200">
    <!-- Manga Cover Wrapper -->
    <div class="relative w-full aspect-[2/3] overflow-hidden">
      <!-- Update Badge -->
      <div v-if="isUp" class="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 z-10 rounded-br-md font-bold uppercase">
        UP
      </div>

      <!-- Manga Cover Image -->
      <NuxtImg :src="data.manga_cover" placeholder="/images/covers/65601c12-d40a-441e-920a-300ae87a2448.jpg"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Manga Cover" />

      <!-- Title Overlay -->
      <div
        class="p-2 absolute inset-0 flex flex-col justify-end items-start bg-gradient-to-t from-black/80 to-transparent text-white">
        <p class="font-semibold text-md line-clamp-2 leading-tight">
          {{ data.manga_title }}
        </p>
      </div>
    </div>

    <!-- Chapter Information -->
    <div class="p-2 flex-grow">
      <p class="font-semibold text-sm truncate">
        Ch. {{ parseInt(data.chapter_id) ? parseInt(data.chapter_id) : 0 }}
      </p>
      <p class="text-xs">
        {{ timeAgo(data.chapter_date_added) ? timeAgo(data.chapter_date_added) : 'Unknown' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { timeAgo } from '~/utils/format'

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      manga_id: 0,
      manga_title: 'Manga Title Placeholder',
      manga_cover: 'https://placehold.co/600x850/333/EEE/png?text=No+Cover',
      chapter_id: 0,
      chapter_name: 'Latest Chapter',
      chapter_date_added: new Date(),
    })
  },
  isUp: {
    type: Boolean,
    default: true
  }
})
</script>