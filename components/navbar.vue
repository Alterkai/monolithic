<template>
  <nav class="flex flex-row justify-between items-center container py-5">
    <NuxtLink to="/" class="font-bold text-2xl">Alterkai</NuxtLink>

    <div class="flex items-center gap-4">

      <!-- SEARCH BUTTON -->
      <UModal v-model:open="modalOpen" :ui="{ wrapper: 'flex items-start justify-center'}">
        <!-- BUTTON -->
        <UButton icon="i-lucide-search" variant="ghost" color="neutral" class="min-md:hidden" />
        <UButton icon="i-lucide-search" variant="outline" color="neutral" class="max-md:hidden min-w-[10rem]">Search...</UButton>
        

        <!-- SEARCH CONTENT -->
        <template #content>
          <div class="p-4">
            <UInput v-model="search" icon="i-lucide-search" placeholder="Search" class="w-full" />

            <!-- SEARCH RESULTS -->
            <div v-if="search.length > 0" class="mt-2">
              <p class="text-sm text-gray-500">Search results for "{{ search }}"</p>

              <div v-for="result in searchResults" class="cursor-pointer" :key="result.id" @click="handleMangaClick()">
                <Searchmangacard :title="result.title" :description="result.description" :image="result.cover"
                  :id="result.id" />
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- TOGGLE DARK/LIGHT MODE -->
      <UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost"
        @click="isDark = !isDark" />

      <!-- USER AVATAR OR LOGIN BUTTON -->
      <ULink v-if="authStore.isLoggedIn == false" to="/login">
        <UButton icon="i-lucide-log-in" variant="subtle" />
      </ULink>
      <UDropdownMenu v-else :items="items" :content="{ side: 'bottom', align: 'end' }" :ui="{ content: 'wd-48' }">
        <UAvatar icon="i-lucide-image" size="xl" :src="authStore.user?.avatar"
          class="cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all" />
      </UDropdownMenu>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { DropdownMenuItem } from '@nuxt/ui';
import { debounce } from '@/server/utils/debounce'

interface SearchMangaResult {
  title: string;
  description: string;
  cover: string;
  id: number;
}

// Color mode
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light';
  }
})

const modalOpen = ref(false);
const searchResults = ref<SearchMangaResult[]>([]);
const search = ref('');
const authStore = useAuthStore();
const userID = authStore.user?.id || null;
const userRoles = Array.isArray(authStore.user?.roles) ? authStore.user.roles : [];
const isAdmin = authStore.user?.roles.includes('Admin');
const isStaff = authStore.user?.isStaff || false;

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: authStore.user?.username || 'Guest',
      avatar: {
        src: authStore.user?.avatar
      },
      type: 'label'
    }
  ],

  ...(isAdmin ? [[
    {
      label: 'Admin Panel',
      icon: 'i-lucide-shield-check',
      to: '/admin'
    }
  ]] : []),
  ...(isStaff ? [[
    {
      label: 'Staff Panel',
      icon: 'i-lucide-users',
      to: '/staff'
    }
  ]] : []),
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: `/user/${userID}`,
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: logout
    }
  ]
])

const performSearch = async (query: string) => {
  if (query.length < 3) {
    return searchResults.value = [];
  }

  try {
    const response = await $fetch<SearchMangaResult[]>(`/api/manga/?title=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Search results:', response);
    if (response && Array.isArray(response)) {
      searchResults.value = response;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    
  }
}

const debouncedSearch = debounce(performSearch, 300);
watch(search, (newQuery) => {
  debouncedSearch(newQuery)
}, { immediate: false })

const handleMangaClick = () => {
  modalOpen.value = false;
  search.value = '';
  searchResults.value = [];
}

const logout = async () => {
  try {
    await authStore.logOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

onBeforeMount(() => {
  debouncedSearch.cancel();
})
</script>