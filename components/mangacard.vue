<template>
  <NuxtLink :to="`/manga/${id}`">
    <div class="flex flex-row p-2 gap-2">
      <NuxtImg :src="image" width="50" />
      <div>
        <h2 class="font-semibold text-lg">{{ title }}</h2>
        <p class="text-sm text-slate-400">{{ description }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default: 'Manga Title'
  },
  description: {
    type: String,
    required: true,
    default: 'Description'
  },
  image: {
    type: String,
    required: true,
    default: 'https://placehold.co/600x850'
  },
  id: {
    type: Number,
    required: true,
  }
})
</script>