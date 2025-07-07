<template>
  <!-- BACK IMAGE -->
  <div class="h-[20rem] overflow-hidden -z-10 relative">
    <USkeleton v-if="isLoading" class="w-full h-full" />
    <NuxtImg v-else ref="parallaxImage" class="w-full object-cover opacity-30 blur-sm select-none inset-0"
      :src="mangaDetails?.cover" :style="{ transform: `translateY(${parallaxOffset}px)` }" draggable="false">
    </NuxtImg>
  </div>

  <div class="container flex flex-col gap-5 -mt-16 z-10">
    <!-- SKELETON LOADING -->
    <div v-if="isLoading" class="flex flex-row gap-5">
      <USkeleton class="w-[15rem] h-[20rem] mb-5" />
      <div class="flex flex-col">
        <USkeleton class="w-[20rem] h-8 mb-2" />
        <USkeleton class="w-[10rem] h-8 mb-2" />
        <USkeleton class="w-[20rem] h-4 mb-2 mt-4" />
        <USkeleton class="w-[20rem] h-4 mb-2" />
      </div>
    </div>
    <div v-if="mangaDetails && isLoading === false" class="flex flex-col min-md:flex-row gap-5">
      <!-- Cover -->
      <NuxtImg :src="mangaDetails.cover" class="min-md:h-[20rem]" style="width: auto" />
      <!-- Content -->
      <div class="flex flex-col gap-2">
        <h1 class="font-bold text-3xl">{{ mangaDetails.title }}</h1>
        <h2 class="text-lg">{{ mangaDetails.original_title }}</h2>

        <USeparator type="solid" color="primary" />

        <!-- STATUS -->
        <div class="flex flex-row gap-4 font-semibold">
          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-eye" class="size-5" />
            <span class="text-sm">x Views</span>
          </div>

          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-star" class="size-5" />
            <span class="text-sm">{{ mangaDetails.ratings }}</span>
          </div>
        </div>

        <!-- DESCRIPTIONS -->
        <p class="text-md text-neutral text-wrap ">{{ mangaDetails.description }}</p>

        <!-- AUTHOR -->
        <span class="text-md">Author: {{ mangaDetails.author }}</span>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-row gap-2 mt-2">
          <UButton color="primary" icon="i-lucide-book-open" size="xl">
            Read
          </UButton>

          <UButton color="secondary" variant="outline" icon="i-lucide-book-marked" size="xl">
            Bookmark
          </UButton>

          <UButton @click="navigateTo(`/admin/addChapter?m_id=${route.params.id}`)" v-if="isAdmin" color="neutral"
            variant="subtle" icon="i-lucide-file-plus-2" size="xl">
            Add Chapter
          </UButton>
        </div>

        <!-- GENRES -->
        <div class="flex flex-row gap-2 mt-4">
          <span v-for="genre in mangaDetails.genre" class="font-semibold text-sm">
            <span v-if="genre == 'yuri'" class="bg-primary p-1 px-1.5 rounded-sm text-white">{{
              capitalizeEachWord(genre) }}</span>
            <span v-else class="p-1 px-1.5 outline outline-current rounded-sm">{{ capitalizeEachWord(genre)
              }}</span>
          </span>
        </div>

      </div>
    </div>

    <!-- CHAPTERS -->
    <p class="text-xl font-semibold mt-5">Chapters</p>
    <div v-if="mangaDetails" class="max-h-[20rem] overflow-y-scroll flex flex-col gap-4 p-4 rounded-sm bg-accented">
      <div v-for="chapter in mangaDetails.chapters" :key="chapter.number" class="flex">
        <NuxtLink
          class="dark:hover:bg-slate-800 light:hover:bg-slate-300 outline outline-current/40 transition ease-in p-2 rounded-md font-semibold w-full"
          :to="`/manga/${mangaDetails.id}/chapter/${chapter.number}`">
          Chapter {{ chapter.number }} - {{ chapter.name }}
          <p class="text-sm font-light">{{ timeAgo(chapter.date_added) }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- COMMENTS -->
    <p class="text-xl font-semibold mt-5">Comments</p>
    <div class="max-h-[20rem] overflow-y-scroll rounded-md">
      <CommentsContainer :manga_id="manga_id" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { timeAgo } from '~/server/utils/format'
import type { Chapter } from '@/types/database'
import { capitalizeEachWord } from '@/server/utils/capitalizeEachWord'

const authStore = useAuthStore();

// Buat sekarang upload chapter cuman boleh sama admin
const isAdmin = computed(() => authStore.user?.roles.includes('Admin'));

const isLoading = ref(false);
const route = useRoute();
const toast = useToast();
const parallaxOffset = ref(0);
const parallaxImage = ref(null);
const manga_id = route.params.id as string;

interface MangaDetail {
  id: number,
  title: string,
  original_title: string,
  description: string,
  cover: string,
  ratings: number,
  genre: string[],
  chapters: Chapter[],
  author: string,
}

const handleScroll = () => {
  if (parallaxImage.value) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    parallaxOffset.value = rate;
  }
}

let mangaDetails = ref<MangaDetail | null>(null);
// Fetch manga details
async function fetchMangaDetails() {
  try {
    isLoading.value = true;
    const results = await $fetch<MangaDetail>(`/api/manga/${route.params.id}`, {
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
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchMangaDetails();
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>