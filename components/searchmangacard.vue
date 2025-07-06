<template>
  <NuxtLink :to="`/manga/${id}`">
    <div class="flex flex-row p-2 gap-2 h-[7rem] hover:outline hover:outline-primary rounded-md">
      <NuxtImg :src="image" />
      <div class="flex flex-col justify-start">
        <h2 class="font-semibold text-lg">{{ title }}</h2>
        <p class="text-sm text-slate-400 line-clamp-3">{{ description }}</p>
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

<style scoped>
img {
  width: auto;
  height: 100px
}
</style>