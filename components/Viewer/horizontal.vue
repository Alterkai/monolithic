<template>
  <div v-if="data && data.length > 0" class="w-full flex flex-col items-center gap-4">
    <!-- Main Viewer Area -->
    <div class="relative w-full max-w-4xl select-none">
      <!-- Display the current image -->
      <NuxtImg v-if="currentImage" :key="currentImage.id" :src="currentImage.link" class="w-full h-auto rounded-md"
        preload :alt="`Image ${currentImage.order}`" />

      <!-- Clickable Navigation Overlays -->
      <div class="absolute top-0 left-0 h-full w-1/2 cursor-pointer" title="Previous Page" @click="previousImage"></div>
      <div class="absolute top-0 right-0 h-full w-1/2 cursor-pointer" title="Next Page" @click="nextImage"></div>
    </div>

    <!-- Navigation Controls -->
    <div class="flex items-center justify-center gap-4 w-full">
      <UButton icon="i-heroicons-arrow-left-20-solid" @click="previousImage" :disabled="isFirstPage"
        aria-label="Previous Image" />
      <span class="text-sm text-gray-500 font-mono">
        {{ currentIndex + 1 }} / {{ data.length }}
      </span>
      <UButton icon="i-heroicons-arrow-right-20-solid" @click="nextImage" :disabled="isLastPage"
        aria-label="Next Image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from 'vue';

interface Image {
  id: number;
  link: string;
  order: number;
}

const props = defineProps({
  data: {
    type: Array as PropType<Image[]>,
    required: true,
    default: () => []
  }
});

// State to track the current image index
const currentIndex = ref(0);

// Computed property to get the current image object
const currentImage = computed(() => props.data[currentIndex.value]);

// Computed properties to check if we are at the beginning or end
const isFirstPage = computed(() => currentIndex.value === 0);
const isLastPage = computed(() => currentIndex.value === props.data.length - 1);

// Navigation functions
const nextImage = () => {
  if (!isLastPage.value) {
    currentIndex.value++;
  }
};

const previousImage = () => {
  if (!isFirstPage.value) {
    currentIndex.value--;
  }
};

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === 'd') {
    nextImage();
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    previousImage();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>