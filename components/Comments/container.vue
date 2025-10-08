<template>
  <div class="flex flex-col gap-2 bg-accented h-[25rem]">

    <!-- COMMENT INPUT -->
    <div class="p-3 flex-shrink-0 w-full">
      <div v-if="isLoggedIn == true" class="flex flex-col w-full items-end gap-2">
        <UTextarea class="flex-1 w-full" v-model="newComment" placeholder="Add a comment..." />
        <UButton @click="submitComment">Submit</UButton>
      </div>

      <div v-else class="text-center w-full">
        <p class="text-sm text-current/50">You must be logged in to comment.</p>
      </div>
    </div>

    <USeparator class="h-1 opacity-50 px-[2rem]" color="primary" />

    <!-- COMMENTS CONTAINER -->
    <div class="overflow-y-auto flex-1">
      <div v-if="pending">
        <p>Loading comments...</p>
      </div>

      <div v-else v-if="comments" v-for="data in comments" :key="data.id"
        class="p-3 flex items-start justify-between gap-2">
        <div class="flex items-start gap-2 flex-1">
          <UAvatar size="2xl" :src="data.user_avatar" icon="i-lucide-circle-user-round"
            class="outline outline-old-neutral-500 rounded-xl overflow-hidden" />
          <div class="flex flex-col">
            <p class="text-md text-current font-semibold">{{ data.username }}</p>
            <p class="text-xs text-current/50 mb-1">{{ new Date(data.date_added).toLocaleDateString() }}</p>
            <p>{{ data.comment }}</p>
          </div>
        </div>

        <!-- Delete Button -->
        <UButton v-if="user?.id === data.user_id" icon="i-lucide-trash" variant="ghost" color="neutral" size="sm"
          @click="deleteComment(data.id)" />
      </div>

      <div v-if="!comments || comments.length === 0" class="p-3 text-center text-current/50">
        No comments yet. Be the first to comment!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { timeAgo } from '~/utils/format';
import apiClient from '~/utils/apiClient';
import type { Comment } from '~/types';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);
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

// Fetch Comments
const { data: comments, pending, error, refresh } = await useAsyncData<Comment[]>(
  `comments-${manga_id}-${chapter_id ?? 'manga'}`,
  () => {
    return apiClient.comments.get(Number(manga_id), chapter_id || undefined)
      .then(response => response.data || []);
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
    await apiClient.comments.create(
      Number(manga_id),
      { comment: newComment.value },
      chapter_id || undefined
    );

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

// Delete Comment function
async function deleteComment(commentId: number) {
  if (!isLoggedIn.value) {
    toast.add({
      title: 'Error',
      description: 'You must be logged in to delete comments.',
      color: 'error',
      duration: 3000
    });
    return;
  }

  try {
    await apiClient.comments.delete(
      Number(manga_id),
      commentId,
      chapter_id || undefined
    );

    // Refresh comments after deletion
    await refresh();

    toast.add({
      title: 'Success',
      description: 'Comment deleted successfully.',
      color: 'success',
      duration: 3000
    });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to delete comment.',
      color: 'error',
      duration: 5000
    });
  }
}

onMounted(() => {
})
</script>