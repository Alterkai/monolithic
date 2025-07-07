<template>
  <div class="container">
    <!-- MAIN FORM -->
    <div class="flex">
      <UForm :state="state" class="flex flex-col w-full mt-5 gap-5">

        <div class="flex flex-row w-full gap-5">
          <NuxtImg class="w-[12rem] h-auto" :src="mangaDetails?.cover" />

          <div class="flex flex-col gap-2 justify-end w-full">
            <h1 class="font-bold text-2xl">Add Chapter</h1>

            <UFormField class="w-full" label="Manga" name="manga">
              <UInputMenu class="w-full" :items="mangaList" v-model="state.mangaID" />
            </UFormField>

            <div class="flex flex-col min-lg:flex-row w-full gap-4">
              <UFormField class="w-full" label="Chapter" name="chapter">
                <UInput class="w-full" type="number" v-model="state.chapterID" />
                <p>Latest Chapter: {{ latestChapterNumber }}</p>
              </UFormField>

              <UFormField class="w-full" label="Chapter Name" name="chapterName">
                <UInput class="w-full" placeholder="Optional" v-model="state.name" />
              </UFormField>
            </div>
          </div>

        </div>

        <h2 class="font-bold text-2xl">Add Images</h2>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const route = useRoute();
const mangaID = route.query.m_id as string;
const isLoading = ref(false);

const state = reactive({
  mangaID: {
    id: mangaID ? parseInt(mangaID) : 0, // Default to 0 if no mangaID is provided
    label: '',
    value: mangaID ? parseInt(mangaID) : 0
  },
  chapterID: 1, // Latest chapter +1
  name: '',
  images: [],
})

interface MangaList {
  id: number;
  label: string;
  value: number;
}

interface Chapter {
  id: number;
  name: string;
  number: number;
  date_added: Date;
}

interface MangaDetails {
  id: number;
  title: string;
  original_title: string;
  cover: string;
  chapters: Chapter[];
}

// Fetch manga details for selected manga clarity
let mangaDetails = ref<MangaDetails | null>(null);
let latestChapterNumber = ref<number | null>(null);
async function fetchMangaDetails(manga_id: string) {
  try {
    isLoading.value = true;
    const response = await $fetch<MangaDetails>(`/api/manga/${manga_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    mangaDetails.value = response;
    latestChapterNumber.value = response.chapters.length > 0 ? response.chapters[response.chapters.length - 1].number : 0;
    state.chapterID = latestChapterNumber.value + 1; // chapterID = latest++
    return response;
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

// Fetch all manga for the dropdown menu

const mangaList = ref<MangaList[]>([]);
const mangaValue = ref<MangaList>();
async function fetchAllManga() {
  try {
    isLoading.value = true;
    const response = await $fetch<MangaDetails[]>('/api/manga', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let mangaListRaw = ref<MangaDetails[]>([]);
    mangaListRaw.value = response;
    mangaList.value = mangaListRaw.value.map(manga => ({
      id: manga.id,
      label: manga.title,
      value: manga.id
    }));

    // Assign default manga dropdown state if mangaID is provided
    const selectedManga = mangaList.value.find(manga => manga.value === parseInt(mangaID));
    if (selectedManga) {
      state.mangaID = selectedManga;
      // fetchMangaDetails();
    } else {
      toast.add({
        title: 'Warning',
        description: 'Selected manga not found in the list.',
        color: 'warning',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error fetching manga list:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to fetch manga list.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

// fetch manga details on input change
watch(() => state.mangaID.id, async (newMangaID) => {
  if (newMangaID > 0) {
    await fetchMangaDetails(newMangaID.toString());
  }
});

onMounted(() => {
  fetchAllManga();
  if (mangaID) fetchMangaDetails(mangaID.toString())
});
</script>