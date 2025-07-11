<template>
  <div class="container">
    <h1 class="font-bold text-4xl">Add Title</h1>

    <!-- MAIN FORM -->
    <div class="flex">
      <UForm :state="state" class="flex flex-col w-full mt-5 gap-5" @submit="onSubmit">
        
        <div class="flex flex-row gap-5">
          <UFormField class="w-full" label="Title" name="title">
            <UInput placeholder="My Food Looks very Cute" class="w-full" v-model="state.title" />
          </UFormField>

          <UFormField class="w-full" label="Original Title" name="original_title">
            <UInput placeholder="我的食物看起来很可爱" class="w-full" v-model="state.original_title" />
          </UFormField>
        </div>

        <UFormField label="Description" name="description">
          <UTextarea placeholder="Tentang Maria, Vampir yang dibangunkan..." class="w-full"
            v-model="state.description" />
        </UFormField>

        <!-- Cover Image Upload -->
        <UFormField label="Cover Image" name="cover">
          <UInput type="file" accept="image/*" @change="handleFileUpload" class="w-full" />
          <!-- Preview -->
          <div v-if="state.coverPreview" class="mt-2">
            <img :src="state.coverPreview" alt="Cover preview" class="w-32 h-48 object-cover rounded" />
          </div>
        </UFormField>

        <div class="flex flex-row gap-5">
          <UFormField class="w-full" label="Author" name="author">
            <UInput placeholder="Xi Luangbo" class="w-full" v-model="state.author" />
          </UFormField>

          <UFormField class="w-full" label="Ratings" name="ratings">
            <UInput type="number" min="0" max="10" step="0.1" class="w-full" v-model.number="state.ratings"
              placeholder="8.5" />
          </UFormField>

          <UFormField class="w-full" label="Genre" name="genre">
            <UInput class="w-full" placeholder="Slice of life, romance, yuri, monster girls, vampire"
              v-model="state.genre" />
          </UFormField>
        </div>

        <div class="flex">
          <UButton loading-auto type="submit" class="mt-4 flex">Add Manga</UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">

const isLoading = ref(false);
const toast = useToast();
const state = reactive({
  title: '',
  original_title: '',
  description: '',
  author: '',
  cover: null as File | null,
  coverPreview: '' as string,
  ratings: 8,
  genre: '',
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    state.cover = file;

    // Create preview
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
    formData.append('title', state.title);
    formData.append('original_title', state.original_title);
    formData.append('description', state.description);
    formData.append('author', state.author);
    formData.append('genre', state.genre);
    formData.append('ratings', state.ratings.toString());

    if (state.cover) {
      formData.append('cover', state.cover);
    }

    interface MangaResponse {
      data: {
        mangaId: number;
      };
    }

    const response = await $fetch<MangaResponse>('/api/manga', {
      method: 'POST',
      body: formData,
    });

    console.log('Manga added successfully:', response);
    toast.add({
      title: 'Success',
      description: 'Manga added successfully!',
      color: 'success',
      duration: 5000
    });

    await navigateTo(`/manga/${response.data.mangaId}`)
  } catch (error) {
    console.error('Error adding manga:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to add manga. Please try again.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}
</script>