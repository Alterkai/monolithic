<template>
  <div class="container">
    <!-- Loading State -->
    <div v-if="pending">
      <p>Loading chapter...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>Could not load the chapter. Please try again later.</p>
    </div>

    <!-- Content -->
    <div v-else-if="chapterData">
      <div class="my-4">
        <NuxtLink class="text-2xl font-bold" :to="`/manga/${mangaID}`">{{ chapter?.title }}</NuxtLink>
        <p class="text-sm font-current/60">{{ chapter ? `Chapter ${parseInt(chapter.chapter.toString())}` : '' }}</p>
        <UButton class="mt-2" variant="subtle" @click="userPreferenceStore.toggleViewMode()">{{
          userPreferenceStore.getViewMode ? "Horizontal View" :
            "Vertical View" }}</UButton>
      </div>

      <!-- Render Images -->
      <div class="flex flex-col items-center">
        <ViewerVertical v-if="userPreferenceStore.getViewMode" :data="chapter?.images || []" />
        <ViewerHorizontal v-else :data="chapter?.images || []" class="max-h-screen overflow-clip" />
      </div>

      <!-- Navigation Button at the Bottom -->
      <div class="flex max-md:flex-col min-lg:flex-row gap-2 mt-4">

        <NuxtLink v-if="chapter?.prevChapter"
          class="p-2 py-4 outline outline-zinc-500 rounded-sm flex gap-2 items-center justify-end min-md:w-full min-md:flex-row-reverse"
          :to="`/manga/${mangaID}/chapter/${parseInt(chapter.prevChapter.toString())}`">
          <p class="font-semibold">Prev Chapter</p>
          <UIcon name="i-lucide-arrow-left" class="size-5" />
        </NuxtLink>

        <NuxtLink v-else
          class="p-2 py-4 outline outline-zinc-500 rounded-sm flex gap-2 items-center justify-end min-md:w-full min-md:flex-row-reverse"
          :to="`/manga/${mangaID}`">
          <p class="font-semibold">Manga Details</p>
          <UIcon name="i-lucide-arrow-left" class="size-5" />
        </NuxtLink>

        <NuxtLink v-if="chapter?.nextChapter"
          class="p-2 py-4 outline outline-zinc-500 rounded-sm flex gap-2 items-center justify-end min-md:w-full"
          :to="`/manga/${mangaID}/chapter/${parseInt(chapter.nextChapter.toString())}`">
          <p class="font-semibold">Next Chapter</p>
          <UIcon name="i-lucide-arrow-right" class="size-5" />
        </NuxtLink>
      </div>

      <div class="mt-5">
        <h2 class="text-xl font-semibold mb-3">Comments</h2>
        <CommentsContainer :manga_id="mangaID" :chapter_id="parseInt(chapterID)" />
      </div>

      <!-- Navigation Button Popup -->
      <Transition name="fade">
        <div v-show="isNavVisible" class="fixed bottom-5 right-5 z-50 flex gap-2">
          <!-- Tombol Previous Chapter (hanya muncul jika ada) -->
          <NuxtLink v-if="chapter?.prevChapter"
            :to="`/manga/${mangaID}/chapter/${parseInt(chapter.prevChapter.toString())}`">
            <UButton variant="subtle" color="neutral" icon="i-lucide-arrow-left" size="lg" />
          </NuxtLink>

          <!-- Tombol Next Chapter (hanya muncul jika ada) -->
          <NuxtLink v-if="chapter?.nextChapter"
            :to="`/manga/${mangaID}/chapter/${parseInt(chapter.nextChapter.toString())}`">
            <UButton variant="subtle" color="neutral" icon="i-lucide-arrow-right" size="lg" />
          </NuxtLink>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserPreference } from '~/stores/userPreference';
import apiClient from '~/utils/apiClient';
// Remove duplicate interface since we have it in types
// import type { ChapterData } from '~/types';

const toast = useToast();
const route = useRoute();
const mangaID = route.params.id as string;
const chapterID = route.params.chapterID as string;
const lastReadStore = useLastReadStore();
const userPreferenceStore = useUserPreference();

const isNavVisible = ref(false);
const lastScrollY = ref(0);
let idleTimer: NodeJS.Timeout | null = null;

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
  nextChapter: number | null;
  prevChapter: number | null;
}

// Fetch data using useAsyncData for SSR and client-side navigation
const { data: chapterData, pending, error } = await useAsyncData<ChapterData>(
  `chapter-${mangaID}-${chapterID}`,
  async () => {
    const response = await apiClient.chapter.get(Number(mangaID), Number(chapterID));
    if (!response.data) {
      throw new Error('Chapter not found');
    }
    return response.data;
  }
);

// Create a computed property for better type safety
const chapter = computed(() => chapterData.value as ChapterData | null);

async function addView() {
  try {
    await apiClient.views.incrementChapterViews(Number(mangaID), Number(chapterID));
  } catch (error) {

  }
}

if (error.value) {
  toast.add({
    title: 'Error fetching chapter data',
    description: error.value.message || 'Failed to load data for this chapter.',
    color: 'error',
    duration: 5000
  });
}

const handleScroll = () => {
  if (idleTimer) clearTimeout(idleTimer);

  const currentScrollY = window.scrollY;
  // Selalu tampilkan tombol jika di paling atas halaman
  if (currentScrollY <= 100) {
    isNavVisible.value = true;
  }
  // Sembunyikan tombol saat scroll ke bawah
  else if (currentScrollY > lastScrollY.value) {
    isNavVisible.value = false;
  }
  // Tampilkan tombol saat scroll ke atas
  else {
    isNavVisible.value = true;
  }
  lastScrollY.value = currentScrollY;

  idleTimer = setTimeout(() => {
    isNavVisible.value = false;
  }, 3000);
};

onMounted(() => {
  lastScrollY.value = window.scrollY;
  window.addEventListener('scroll', handleScroll);

  addView();
  lastReadStore.setLastRead(parseInt(mangaID), parseInt(chapterID))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* CSS for the fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>