<template>
  <div class="flex flex-col gap-2 bg-accented h-[20rem]">

    <!-- TEXTBOX -->
    <div class="p-3 flex flex-col flex-shrink-0 w-full">
      <div v-if="isLoggedIn == true" class="flex flex-col w-full items-end gap-2">
        <UTextarea class="flex-1 w-full" v-model="newComment" placeholder="Add a comment..." />
        <UButton @click="submitComment">Submit</UButton>
      </div>

      <div v-else class="text-center w-full">
        <p class="text-sm text-current/50">You must be logged in to comment.</p>
      </div>
    </div>


    <div v-if="pending">
      <p>Loading comments...</p>
    </div>

    <!-- COMMENTS -->
    <div v-else v-if="comments" v-for="data in comments" :key="data.id" class="p-3 flex items-start gap-2">
      <UAvatar size="2xl" :src="data.user_avatar" />
      <div class="flex flex-col">
        <p class="text-sm text-current/80">@{{ data.username }}</p>
        <p class="text-xs text-current/50 mb-1">{{ new Date(data.date_added).toLocaleDateString() }}</p>
        <p>{{ data.comment }}</p>
      </div>
    </div>

    <div v-if="!comments || comments.length === 0" class="p-3 text-center text-current/50">
      No comments yet. Be the first to comment!
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const isLoading = ref(false);
const toast = useToast();
const props = defineProps({
  manga_id: {
    type: String,
    required: true
  },
  chapter_id: {
    type: Number,
    required: false,
    default: null
  }
});
const { manga_id, chapter_id } = props;

const newComment = ref('');

interface Comment {
  id: number;
  comment: string;
  user_id: string;
  username: string;
  date_added: Date;
  user_avatar: string;
}

// Fetch Comments
const { data: comments, pending, error, refresh } = await useAsyncData<Comment[]>(
  `comments-${manga_id}-${chapter_id ?? 'manga'}`,
  () => {
    const url = chapter_id
      ? `/api/manga/${manga_id}/${chapter_id}/comments`
      : `/api/manga/${manga_id}/comments`;
    return $fetch(url);
  }, {
  default: () => []
}
);

if (error.value) {
  toast.add({
    title: 'Error',
    description: 'Failed to fetch comments.',
    color: 'error',
    duration: 5000
  });
}

// Submit comment
async function submitComment() {
  if (!newComment.value.trim()) {
    toast.add({
      title: 'Error',
      description: 'Comment cannot be empty.',
      color: 'error',
      duration: 3000
    });
    return;
  }

  try {
    isLoading.value = true;
    await $fetch(`/api/manga/${manga_id}/${chapter_id ? chapter_id + '/' : ''}comments`, {
      method: 'POST',
      body: {
        comment: newComment.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Clear the input field
    newComment.value = '';
    // Fetch updated comments
    await refresh();
    
    toast.add({
      title: 'Success',
      description: 'Comment added successfully.',
      color: 'success',
      duration: 3000
    });
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to submit comment.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
})
</script>