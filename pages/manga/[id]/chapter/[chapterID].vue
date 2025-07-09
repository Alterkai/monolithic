<template>
  <div class="container">
    <!-- Loading State -->
    <div v-if="pending">
      <p>Loading chapter...</p>
      <!-- Anda bisa menambahkan komponen skeleton di sini -->
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>Could not load the chapter. Please try again later.</p>
    </div>

    <!-- Content -->
    <div v-else-if="chapterData">
      <div class="my-4">
        <h1 class="text-2xl font-bold">{{ chapterData.title }}</h1>
        <p class="text-sm font-current/60">{{ `Chapter ${parseInt(chapterData.chapter.toString())}` }}</p>
      </div>

      <!-- Render Images -->
      <div class="flex flex-col items-center">
        <ViewerHorizontal :data="chapterData.images" />
      </div>

      <CommentsContainer :manga_id="mangaID" :chapter_id="parseInt(chapterID)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const route = useRoute();
const mangaID = route.params.id as string;
const chapterID = route.params.chapterID as string;

interface Image {
  id: number;
  link: string;
  order: number;
}

interface ChapterData {
  title: string;
  chapter: number;
  name: string;
  date_added: Date;
  images: Image[];
}

// Fetch data using useAsyncData for SSR and client-side navigation
const { data: chapterData, pending, error } = await useAsyncData<ChapterData>(
  `chapter-${mangaID}-${chapterID}`,
  () => $fetch(`/api/manga/${mangaID}/${chapterID}`)
);

if (error.value) {
  toast.add({
    title: 'Error fetching chapter data',
    description: error.value.message || 'Failed to load data for this chapter.',
    color: 'error',
    duration: 5000
  });
}
</script>