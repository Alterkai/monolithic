<template>
  <div class="flex flex-col gap-2 bg-accented h-[20rem]">
    <div v-if="isLoading">

    </div>

    <div v-else v-for="data in comments" :key="data.id" class="p-3 flex items-start gap-2">
      <UAvatar size="2xl" :src="data.user_avatar" />
      <div class="flex flex-col">
        <p class="text-sm text-current/80">@{{ data.username }}</p>
        <p class="text-xs text-current/50 mb-1">{{ new Date(data.date_added).toLocaleDateString() }}</p>
        <p>{{ data.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

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

interface Comment {
  id: number;
  comment: string;
  user_id: string;
  username: string;
  date_added: Date;
  user_avatar: string;
}

let comments = ref<Comment[]>([]);
async function fetchComments() {
  try {
    isLoading.value = true;
    // Fetch from chapters
    if (chapter_id) {
      const results = await $fetch<Comment[]>(`/api/manga/${manga_id}/${chapter_id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      comments.value = results;
    } else {
      // Fetch from manga
      const results = await $fetch<Comment[]>(`/api/manga/${manga_id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      comments.value = results;
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to fetch comments.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchComments();
})
</script>