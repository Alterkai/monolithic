<template>
  <div class="relative">
    <NuxtImg :src="data.manga_cover" placeholder="/images/covers/65601c12-d40a-441e-920a-300ae87a2448.jpg"
      class="h-[17rem] w-auto" />
    <div style="top: -10px;">
      <p style="top: -20rem" class="font-semibold">{{ data.manga_title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      last_read_chapter: 0,
      date_added: new Date(),
      user_id: 0,
      manga_id: 0,
      manga_title: 'Manga Title',
      manga_cover: 'https://placehold.co/600x850'
    })
  }
})
</script>