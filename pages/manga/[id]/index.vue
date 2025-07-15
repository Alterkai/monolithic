<template>
  <!-- BACK IMAGE -->
  <div class="h-[25rem] min-lg:h-[20rem] overflow-hidden -z-10 relative">
    <USkeleton v-if="pending" class="w-full h-full" />
    <NuxtImg v-else ref="parallaxImage" class="w-full object-cover opacity-30 blur-sm select-none inset-0"
      :src="mangaDetails?.manga_cover" :style="{ transform: `translateY(${parallaxOffset}px)` }" draggable="false">
    </NuxtImg>
  </div>

  <div class="container flex flex-col gap-5 -mt-[25rem] min-md:-mt-[7rem] z-10">
    <!-- SKELETON LOADING -->
    <div v-if="pending" class="flex flex-row gap-5">
      <USkeleton class="w-[15rem] h-[20rem] mb-5" />
      <div class="flex flex-col">
        <USkeleton class="w-[20rem] h-8 mb-2" />
        <USkeleton class="w-[10rem] h-8 mb-2" />
        <USkeleton class="w-[20rem] h-4 mb-2 mt-4" />
        <USkeleton class="w-[20rem] h-4 mb-2" />
      </div>
    </div>
    <!-- ERROR STATE -->
    <div v-else-if="error">
      <p>Could not load manga details. Please try again later.</p>
    </div>
    <div v-else-if="mangaDetails" class="flex w-full flex-col min-md:flex-row gap-5">
      <!-- Cover -->
      <NuxtImg :src="mangaDetails.manga_cover" class="min-md:h-[20rem]" style="width: auto" />
      <!-- Content -->
      <div class="flex w-full flex-col gap-2">
        <h1 class="font-bold text-3xl">{{ mangaDetails.manga_title }}</h1>
        <h2 class="text-lg">{{ mangaDetails.manga_original_title }}</h2>

        <USeparator type="solid" color="primary" />

        <!-- STATUS -->
        <div class="flex flex-row gap-4 font-semibold">
          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-eye" class="size-5" />
            <span class="text-sm">{{ mangaViews }} Views</span>
          </div>

          <div class="flex flex-row items-center gap-2">
            <UIcon name="i-lucide-star" class="size-5" />
            <span class="text-sm">{{ mangaDetails.manga_ratings }}</span>
          </div>
        </div>

        <!-- DESCRIPTIONS -->
        <p class="text-md text-neutral text-wrap ">{{ mangaDetails.manga_description }}</p>

        <!-- AUTHOR -->
        <span class="text-md">Author: {{ mangaDetails.manga_author }}</span>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-row gap-2 mt-2">
          <UButton color="primary" @click="navigateTo(`/manga/${manga_id}/chapter/${readNow}`)" icon="i-lucide-book-open" size="xl">
            Read
          </UButton>

          <ClientOnly v-if="isLoggedIn">
            <UButton v-if="!isBookmarked" @click="addBookmark()" color="secondary" variant="outline"
              icon="i-lucide-book-marked" size="xl">
              Bookmark
            </UButton>
            <UButton v-else color="secondary" @click="removeBookmark()" variant="soft" icon="i-lucide-book-marked" size="xl">
              Saved
            </UButton>

            <UButton @click="navigateTo(`/admin/addChapter?m_id=${route.params.id}`)" v-if="isAdmin" color="neutral"
              variant="subtle" icon="i-lucide-file-plus-2" size="xl">
              Add Chapter
            </UButton>

            <UButton @click="navigateTo(`/admin/editManga/${route.params.id}`)" v-if="isAdmin" color="neutral"
              variant="subtle" icon="i-lucide-square-pen" size="xl">
              Edit
            </UButton>
          </ClientOnly>
        </div>

        <!-- GENRES -->
        <div class="h-auto gap-y-2 flex flex-row flex-wrap mt-4 min-xl:max-w-[70%]">
          <span v-for="genre in mangaDetails.manga_genres" class="p-1 h-auto font-semibold text-sm">
            <span v-if="genre.genre_name == 'yuri' || genre.genre_name == 'smut'" class="bg-primary p-1 px-1.5 rounded-sm text-white">{{
              capitalizeEachWord(genre.genre_name) }}</span>
            <span v-else class="p-1 px-1.5 outline outline-current rounded-sm">{{ capitalizeEachWord(genre.genre_name)
              }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- CHAPTERS -->
    <p class="text-xl font-semibold mt-5">Chapters</p>
    <div v-if="mangaDetails" class="max-h-[20rem] overflow-y-scroll flex flex-col gap-4 p-4 rounded-sm bg-accented">
      <div v-if="mangaDetails.manga_chapters?.length === 0" class="text-center text-current/60">
        No chapters available for this manga.
      </div>
      <div v-for="chapter in sortedChapters" :key="chapter.chapter_id" class="flex">
        <NuxtLink
          class="dark:hover:bg-slate-800 light:hover:bg-slate-300 outline outline-current/40 transition ease-in p-2 rounded-md font-semibold w-full"
          :class="{ 'text-current/60 dark:text-slate-400 light:text-slate-500': chapter.chapter_id <= lastRead }"
          :to="`/manga/${mangaDetails.manga_id}/chapter/${chapter.chapter_id}`">
          <div class="flex justify-between items-center">
            <div>
              Ch. {{ chapter.chapter_id }} {{ chapter.chapter_name ? `- ${chapter.chapter_name}` : '' }}
              <p class="text-sm font-light">{{ timeAgo(chapter.chapter_date_added) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-eye" class="size-4" />
              {{ chapter.chapter_views }}
            </div>
          </div>
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

<script setup lang="ts">
import { timeAgo } from '~/utils/format'
import { capitalizeEachWord } from '~/utils/capitalizeEachWord'
import type { Manga, Chapter } from '~/types/manga'

const authStore = useAuthStore();
const lastReadStore = useLastReadStore();
const route = useRoute();
const manga_id = route.params.id as string;
const toast = useToast();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userId = authStore.user?.id;

const isBookmarked = ref(false);
const lastRead = ref(1);

// Buat sekarang upload chapter cuman boleh sama admin
const isAdmin = computed(() => authStore.user?.roles.includes('Admin'));

const parallaxOffset = ref(0);
const parallaxImage = ref(null);

interface MangaFetchData {
  mangaDetails: Manga;
  total_views: number;
}

interface MangaViewsResponse {
  total_views: number;
}

// Fetch data using useAsyncData
const { data, pending, error } = await useAsyncData<MangaFetchData>(async () => {
  const [mangaDetails, mangaViews] = await Promise.all([
    $fetch<Manga>(`/api/manga/${manga_id}`),
    $fetch<MangaViewsResponse>(`/api/views/${manga_id}`)
  ]);
  return {
    mangaDetails,
    total_views: mangaViews.total_views
  };
});

const mangaDetails = computed(() => data.value?.mangaDetails);
const mangaViews = computed(() => data.value?.total_views);

const sortedChapters = computed(() => {
  if (!mangaDetails.value?.manga_chapters) {
    return [];
  }
  return [...mangaDetails.value.manga_chapters].sort((a, b) => b.chapter_id - a.chapter_id);
});

async function addBookmark() {
  try {
    if (!mangaDetails.value || !userId) {
      toast.add({
        title: 'Error',
        description: 'Not Logged In.',
        color: 'error',
        duration: 5000
      });
      return;
    }
    await $fetch(`/api/user/${userId}/bookmarks`, {
      method: 'POST',
      body: {
        manga_id: mangaDetails.value.manga_id,
        last_read_chapter_id: lastRead.value
      }
    })
    fetchIsBookmarked();
    toast.add({
      title: 'Success',
      description: 'Bookmark added successfully.',
      color: 'success',
      duration: 5000
    });
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to add bookmark.',
      color: 'error',
      duration: 5000
    });
  }
}

async function removeBookmark() {
  try {
    if (!mangaDetails.value || !userId) {
      toast.add({
        title: 'Error',
        description: 'Not Logged In.',
        color: 'error',
        duration: 5000
      });
      return;
    }
    await $fetch(`/api/user/${userId}/bookmarks/${mangaDetails.value.manga_id}`, {
      method: 'DELETE'
    });
    isBookmarked.value = false;
    toast.add({
      title: 'Success',
      description: 'Bookmark removed successfully.',
      color: 'success',
      duration: 5000
    });
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to remove bookmark.',
      color: 'error',
      duration: 5000
    });
  }
}

async function fetchIsBookmarked() {
  if (!userId) {
    return false;
  }
  try {
    await $fetch(`/api/user/${userId}/bookmarks/${manga_id}`);
    isBookmarked.value = true;
  } catch (error) {
    // console.error('Error checking bookmark:', error);
    return isBookmarked.value = false;
  }
}

async function addMangaView() {
  try {
    await $fetch(`/api/views/${manga_id}`, {
      method: 'POST'
    });
  } catch (error) {

  }
}

const readNow = ref(0);
async function lastReadFunction() {
  try {
    await $fetch(`/api/manga/${manga_id}/chapter/${lastRead.value}`, {
      method: 'GET'
    })
    readNow.value = lastRead.value + 1;
  } catch (error) {
    readNow.value = lastRead.value;
  }
}

// Handle potential errors from the fetch operation
if (error.value) {
  console.error('Error fetching manga details:', error.value);
  toast.add({
    title: 'Error',
    description: 'Failed to fetch manga details.',
    color: 'error',
    duration: 5000
  });
}

const handleScroll = () => {
  if (parallaxImage.value) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    parallaxOffset.value = rate;
  }
}

onMounted(() => {
  lastReadFunction();
  addMangaView();
  fetchIsBookmarked();
  lastRead.value = lastReadStore.getLastRead(parseInt(manga_id));
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<style>
Button:hover {
  cursor: pointer;
}
</style>