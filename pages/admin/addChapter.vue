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
        <UFormField class="w-full" label="Images" name="images">
          <UInput type="file" class="w-full" multiple accept="image/*" @change="handleFileChange" />
        </UFormField>

        <!-- Image Previews and Progress Bars -->
        <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <div v-for="(img, index) in imagePreviews" :key="index"
            class="relative border rounded-lg p-2 flex flex-col gap-2">
            <!-- Delete Button -->
            <UButton icon="i-heroicons-x-mark-20-solid" size="xs" color="error" class="absolute top-1 right-1 z-10"
              @click="removeImage(index)" />
            <NuxtImg :src="img.previewUrl" class="w-full h-32 object-cover rounded-md" />
            <p class="text-xs truncate" :title="img.name">{{ img.name }}</p>
            <UProgress v-if="img.status === 'compressing' || img.status === 'compressed'" :value="img.progress"
              size="sm" />
            <p v-if="img.status === 'compressed'" class="text-xs text-green-500">Ready to upload</p>
            <p v-if="img.status === 'error'" class="text-xs text-red-500">Compression failed</p>
          </div>
        </div>

        <UButton @click="submitChapter" :loading="isUploading" label="Add Chapter" />
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import imageCompression from 'browser-image-compression';

const toast = useToast();
const route = useRoute();
const mangaID = route.query.m_id as string;
const isLoading = ref(false);
const isUploading = ref(false);

const state = reactive({
  mangaID: {
    id: mangaID ? parseInt(mangaID) : 0,
    label: '',
    value: mangaID ? parseInt(mangaID) : 0
  },
  chapterID: 1,
  name: '',
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

interface ImagePreview {
  name: string;
  previewUrl: string;
  progress: number;
  status: 'slicing' | 'compressing' | 'compressed' | 'error' | 'uploading' | 'uploaded';
  compressedFile: File | null;
  uploadedUrl?: string;
}

const imagePreviews = ref<ImagePreview[]>([]);

function removeImage(index: number) {
  const imageToRemove = imagePreviews.value[index];
  if (imageToRemove) {
    URL.revokeObjectURL(imageToRemove.previewUrl);
  }
  imagePreviews.value.splice(index, 1);
}

/**
 * Processes a single image file. If it's too long, it slices it into multiple files.
 * @param file The original image file.
 * @returns A promise that resolves to an array of File objects.
 */
function sliceLongImage(file: File): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      URL.revokeObjectURL(objectUrl); // Clean up immediately

      // Condition to slice: height is more than double the width
      if (height > width * 2) {
        const slices: File[] = [];
        const sliceHeight = width; // Make slices square-ish for consistency
        const numSlices = Math.ceil(height / sliceHeight);
        const baseName = file.name.replace(/\.[^/.]+$/, "");

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));

        canvas.width = width;
        canvas.height = sliceHeight;

        let promises: Promise<void>[] = [];
        for (let i = 0; i < numSlices; i++) {
          const y = i * sliceHeight;
          const currentSliceHeight = Math.min(sliceHeight, height - y);

          // Adjust canvas height for the last, possibly shorter, slice
          if (canvas.height !== currentSliceHeight) {
            canvas.height = currentSliceHeight;
          }

          ctx.drawImage(img, 0, y, width, currentSliceHeight, 0, 0, width, currentSliceHeight);

          const promise = new Promise<void>((resolveCanvas) => {
            canvas.toBlob((blob) => {
              if (blob) {
                // Pad index for better sorting (e.g., part-01, part-02)
                const paddedIndex = (i + 1).toString().padStart(2, '0');
                const newFileName = `${baseName}-part-${paddedIndex}.webp`;
                slices.push(new File([blob], newFileName, { type: 'image/webp' }));
              }
              resolveCanvas();
            }, 'image/webp', 0.9); // Use high quality for slicing before final compression
          });
          promises.push(promise);
        }
        Promise.all(promises).then(() => resolve(slices));
      } else {
        // If not long, return the original file in an array
        resolve([file]);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not load image: ${file.name}`));
    };
  });
}


async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  // 1. Reset state
  isUploading.value = false;
  imagePreviews.value.forEach(img => URL.revokeObjectURL(img.previewUrl));
  imagePreviews.value = [];

  // 2. Process slicing first
  const allFilesToCompress: File[] = [];
  toast.add({ id: 'processing', title: 'Processing images...', description: 'Slicing long images if necessary.' });

  const processingPromises = Array.from(files).map(async (file) => {
    try {
      const processedFiles = await sliceLongImage(file);
      allFilesToCompress.push(...processedFiles);
    } catch (error) {
      console.error('Slicing error:', error);
      toast.add({ title: `Failed to process ${file.name}`, color: 'error' });
    }
  });
  await Promise.all(processingPromises);
  toast.remove('processing');

  // 3. Now, compress all resulting files (original or sliced)
  const compressionPromises = allFilesToCompress.map(async (file, index) => {
    const preview: ImagePreview = {
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'compressing',
      compressedFile: null,
    };
    imagePreviews.value.push(preview);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8,
        onProgress: (p: number) => {
          // Find the correct preview to update, as index might not match due to async nature
          const previewToUpdate = imagePreviews.value.find(p => p.previewUrl === preview.previewUrl);
          if (previewToUpdate) previewToUpdate.progress = p;
        },
      };
      const compressedFile = await imageCompression(file, options);

      const previewToUpdate = imagePreviews.value.find(p => p.previewUrl === preview.previewUrl);
      if (previewToUpdate) {
        previewToUpdate.compressedFile = compressedFile;
        previewToUpdate.status = 'compressed';
        previewToUpdate.progress = 100;
      }
    } catch (error) {
      console.error('Compression error:', error);
      const previewToUpdate = imagePreviews.value.find(p => p.previewUrl === preview.previewUrl);
      if (previewToUpdate) previewToUpdate.status = 'error';
      toast.add({ title: `Failed to compress ${file.name}`, color: 'error' });
    }
  });

  await Promise.all(compressionPromises);

  // Sort the previews for the UI as soon as they are all processed
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  imagePreviews.value.sort((a, b) => collator.compare(a.name, b.name));
}

async function submitChapter() {
  if (imagePreviews.value.some(img => img.status !== 'compressed')) {
    toast.add({ title: 'Error', description: 'Not all images are compressed and ready. Please wait or remove failed items.', color: 'error' });
    return;
  }
  if (imagePreviews.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select images to upload.', color: 'error' });
    return;
  }

  isUploading.value = true;

  try {
    // 1. Sort images logically by filename (e.g., 1, 2, ..., 10, 11)
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    imagePreviews.value.sort((a, b) => collator.compare(a.name, b.name));

    // 2. Create a single FormData object
    const formData = new FormData();

    // 3. Append chapter details
    formData.append('chapterNumber', state.chapterID.toString());
    formData.append('chapterName', state.name);

    // 4. Append all sorted, compressed files
    imagePreviews.value.forEach(img => {
      if (img.compressedFile) {
        // The third argument is the filename the server will see
        formData.append('files', img.compressedFile, img.name);
      }
    });

    // 5. Send a single request to the new backend endpoint
    await $fetch(`/api/manga/${state.mangaID.id}/upload`, {
      method: 'POST',
      body: formData,
    });

    toast.add({ title: 'Success', description: 'Chapter and images uploaded successfully!', color: 'success' });

    // 6. Reset the form for the next chapter
    imagePreviews.value.forEach(img => URL.revokeObjectURL(img.previewUrl)); // Clean up memory
    imagePreviews.value = [];
    state.chapterID++; // Auto-increment for the next chapter
    state.name = '';

  } catch (error: any) {
    console.error('Upload/Chapter creation error:', error);
    toast.add({ title: 'Error', description: error.data?.message || 'An error occurred during upload.', color: 'error' });
  } finally {
    isUploading.value = false;
  }
}

onBeforeUnmount(() => {
  // Clean up object URLs to prevent memory leaks
  imagePreviews.value.forEach(img => URL.revokeObjectURL(img.previewUrl));
});
</script>