<template>
  <div v-if="isLoading">
    <USkeleton />
  </div>

  <div v-else class="container">
    <!-- PROFILE -->
    <div v-if="authStore.user && userDetails" class="flex flex-col gap-5">
      <div class="flex flex-row justify-start items-end gap-3">
        <NuxtImg :src="userDetails.avatar" width="150" height="150" v-slot="{ src }"
          placeholder="/images/default-avatar.png" />

        <div>
          <h1 class="text-2xl font-bold">{{ userDetails.name }}</h1>
          <p class="text-gray-600">@{{ userDetails.username }}</p>
          <p class="text-sm text-gray-500">Joined: {{ new Date(userDetails.date_joined).toLocaleDateString() }}</p>
          <div class="mt-4">
            <UBadge v-for="role in userDetails.roles" :key="role.id" color="primary" variant="outline">
              {{ role.name }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- BOOKMARKS -->
      <div>
        <h1 class="font-bold text-xl">Bookmarks</h1>
        <div v-if="authStore.user">
          <div v-for="bookmark in userBookmarks">
            {{ bookmark.manga_title }}
          </div>
        </div>
        
        <div v-else>
          <p class="text-gray-500">You need to be logged in to see bookmarks.</p>
        </div>
      </div>

    </div>

    <div v-else class="text-center">
      <p class="text-gray-500">No user details available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">

const toast = useToast();
const authStore = useAuthStore();
const isLoading = ref(false);

interface Roles {
  id: number,
  name: string;
}

interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  roles: Roles[];
  date_joined: Date;
}

interface Response {
  success: boolean;
  user: UserDetail;
}

interface UserBookmark {
  id: number;
  last_read_chapter: number;
  date_added: Date;
  user_id: number;
  manga_id: number;
  manga_title: string;
  manga_cover: string;
}

let userDetails = ref<UserDetail | null>(null);
let userBookmarks = ref<UserBookmark[]>([]);
const userID = authStore.user?.id;

async function fetchUserDetail() {
  try {
    isLoading.value = true;
    const result = await $fetch<Response>(`/api/user/${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('User details fetched:', result);
    userDetails.value = result.user;
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to fetch user details.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

async function fetchUserBookmarks() {
  try {
    const result = await $fetch<UserBookmark[]>(`/api/user/${userID}/bookmarks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    userBookmarks.value = result;
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to fetch user bookmarks.',
      color: 'error',
      duration: 5000
    });
  }
}

onMounted(() => {
  fetchUserDetail();
  fetchUserBookmarks();
});
</script>