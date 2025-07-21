<template>
  <div class="container">
    <div class="flex gap-4 h-[15rem]">
      <!-- Preview image logic remains the same -->
      <NuxtImg :src="state.coverPreview || (typeof state.cover === 'string' ? state.cover : undefined)"
        class="w-auto" />
      <div>
        <h1 class="text-md">Edit Title:</h1>
        <!-- Bind to the new state property -->
        <h1 class="font-bold text-3xl">{{ state.manga_title }}</h1>
      </div>
    </div>

    <!-- MAIN FORM -->
    <div class="flex">
      <UForm :state="state" class="flex flex-col w-full mt-5 gap-5" @submit="onSubmit">

        <div class="flex flex-row gap-5">
          <!-- Bind UFormField and UInput to the new state properties -->
          <UFormField class="w-full" label="Title" name="manga_title">
            <UInput placeholder="My Food Looks very Cute" class="w-full" v-model="state.manga_title" />
          </UFormField>

          <UFormField class="w-full" label="Original Title" name="manga_original_title">
            <UInput placeholder="我的食物看起来很可爱" class="w-full" v-model="state.manga_original_title" />
          </UFormField>
        </div>

        <UFormField label="Description" name="manga_description">
          <UTextarea placeholder="Tentang Maria, Vampir yang dibangunkan..." class="w-full"
            v-model="state.manga_description" />
        </UFormField>

        <!-- Cover Image Upload logic remains the same -->
        <UFormField label="Cover Image" name="cover">
          <UInput type="file" accept="image/*" @change="handleFileUpload" class="w-full" />
          <div v-if="state.coverPreview" class="mt-2">
            <img :src="state.coverPreview" alt="Cover preview" class="w-32 h-48 object-cover rounded" />
          </div>
        </UFormField>

        <div class="flex flex-row gap-5">
          <!-- Bind UFormField and UInput to the new state properties -->
          <UFormField class="w-full" label="Author" name="manga_author">
            <UInput placeholder="Xi Luangbo" class="w-full" v-model="state.manga_author" />
          </UFormField>

          <UFormField class="w-full" label="Ratings" name="manga_ratings">
            <UInput type="number" min="0" max="10" step="0.1" class="w-full" v-model.number="state.manga_ratings"
              placeholder="8.5" />
          </UFormField>

          <UFormField class="w-full" label="Genre" name="manga_genres">
            <UInput class="w-full" placeholder="Slice of life, romance, yuri, monster girls, vampire"
              v-model="state.manga_genres" />
          </UFormField>
        </div>

        <div class="flex">
          <UButton :loading="isLoading" type="submit" class="mt-4 flex">Commit Changes</UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the central Manga type
import type { Manga } from '~/types/manga';

const routeId = useRoute().params.id;
const manga_id = Array.isArray(routeId) ? Number(routeId[0]) : Number(routeId);
const isLoading = ref(false);
const toast = useToast();

// Update state properties to match the Manga type
const state = reactive({
  manga_title: '',
  manga_original_title: '',
  manga_description: '',
  manga_author: '',
  cover: null as File | null, // For file upload
  coverPreview: '' as string, // For image preview
  manga_ratings: 8,
  manga_genres: '', // Genres as a comma-separated string for the input field
});

// Fetch existing manga data
if (manga_id) {
  // Use the imported Manga type for the fetch
  const { data: mangaData } = await useAsyncData('manga-details', () =>
    $fetch<Manga>(`/api/manga/${manga_id}`)
  );

  // Populate state using the new property names from the API response
  if (mangaData.value) {
    state.manga_title = mangaData.value.manga_title;
    state.manga_original_title = mangaData.value.manga_original_title;
    state.manga_description = mangaData.value.manga_description;
    state.manga_author = mangaData.value.manga_author;
    state.manga_ratings = mangaData.value.manga_ratings;
    // The API returns an array of objects, so we map and join them for the input field
    if (mangaData.value.manga_genres) {
      state.manga_genres = mangaData.value.manga_genres.map(g => g.genre_name).join(', ');
    }
    state.coverPreview = mangaData.value.manga_cover;
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    state.cover = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.coverPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const onSubmit = async () => {
  try {
    isLoading.value = true;
    const formData = new FormData();
    // Append data to FormData using the new property names
    formData.append('title', state.manga_title);
    formData.append('original_title', state.manga_original_title);
    formData.append('description', state.manga_description);
    formData.append('author', state.manga_author);
    formData.append('genre', state.manga_genres);
    formData.append('ratings', state.manga_ratings.toString());

    if (state.cover) {
      formData.append('cover', state.cover);
    }

    interface MangaResponse {
      data: {
        mangaId: number;
      };
    }

    const response = await $fetch<MangaResponse>(`/api/manga/${manga_id}`, {
      method: 'PATCH',
      body: formData,
    });

    toast.add({
      title: 'Success',
      description: 'Manga updated successfully!',
      color: 'success',
      duration: 5000
    });

    await navigateTo(`/manga/${response.data.mangaId}`)
  } catch (error) {
    console.error('Error updating manga:', error);
    const fetchError = error as { data?: { statusMessage?: string } };
    toast.add({
      title: 'Error',
      description: fetchError.data?.statusMessage || 'Failed to update manga. Please try again.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}
</script>