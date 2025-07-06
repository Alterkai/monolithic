<template>
  <div v-if="isLoading" class="container">
    <div class="flex flex-col gap-5 ">
      <div class="flex flex-row justify-start items-end gap-5">
        <USkeleton class="w-[150px] h-[150px] rounded-full" />
        <div class="flex flex-col gap-2">
          <USkeleton class="h-[30px] w-[200px]" />
          <USkeleton class="h-[20px] w-[150px]" />
          <USkeleton class="h-[20px] w-[200px]"/>
          <div class="flex flex-wrap gap-2">
            <USkeleton width="80px" height="20px" v-for="i in 3" :key="i" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <!-- PROFILE -->
    <div v-if="userDetails" class="flex flex-col gap-5">
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
        <div v-if="userID">
          <div v-for="bookmark in userBookmarks">
            <!-- TODO: implement manga card -->
            <MangacardBookmark :data="bookmark" />
          </div>
        </div>

        <div v-else>
          <p class="text-gray-500">You need to be logged in to see bookmarks.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

const toast = useToast();
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
const route = useRoute();
const userID = route.params.id as string;

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
    fetchUserBookmarks();
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
    isLoading.value = true;
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
});
</script>