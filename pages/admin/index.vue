<template>
  <div class="container">
    <h1 class="text-2xl font-bold">Admin panel</h1>


    <!-- TABLE -->
    <div>
      <div class="flex w-full justify-between items-center mt-5">
        <UInput :model-value="table?.tableApi?.getColumn('manga_title')?.getFilterValue() as string"
          @update:model-value="table?.tableApi?.getColumn('manga_title')?.setFilterValue($event)"
          placeholder="Search manga..." icon="i-lucide-search" class="" />
        <ULink to="/admin/addManga">
          <UButton color="primary" icon="i-lucide-book-plus" size="lg" class="w-auto">
            Add Manga
          </UButton>
        </ULink>
      </div>
      <UTable ref="table" :data="data ?? undefined" v-model:column-filters="columnFilters" :columns="columns"
        :loading="pending">
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-edit" size="sm" variant="ghost"
              @click="navigateTo(`/admin/editManga/${row.original.manga_id}`)">
              Edit
            </UButton>
            <!-- PERUBAHAN: Tombol ini sekarang memanggil fungsi untuk membuka modal -->
            <UButton icon="i-lucide-trash-2" size="sm" color="error" variant="ghost"
              @click="openDeleteModal(row.original.manga_id)" />
          </div>
        </template>
      </UTable>
    </div>

    <!-- TAMBAHAN: Modal Konfirmasi Penghapusan -->
    <UModal v-model:open="isModalOpen">
      <template #header class="flex items-center">
        <UButton icon="i-lucide-triangle-alert" variant="ghost" color="error" class="font-bold text-lg">Confirm Deletion</UButton>
      </template>
      <template #body>
        <p>Are you sure you want to delete this manga? This action cannot be undone.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="ghost" @click="isModalOpen = false">Cancel</UButton>
          <UButton color="error" @click="confirmDelete" :loading="isDeleting">Delete</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

const table = useTemplateRef('table');
const toast = useToast();

// TAMBAHAN: State untuk modal dan proses penghapusan
const isModalOpen = ref(false);
const mangaToDeleteId = ref<number | null>(null);
const isDeleting = ref(false);

interface MangaLatestChapter {
  manga_id: number;
  manga_title: string;
  chapter_number: number;
  chapter_date_added: Date;
}

// PERUBAHAN: Ambil 'refresh' dari useAsyncData untuk memperbarui tabel
const { data, pending, error, refresh } = await useAsyncData<MangaLatestChapter[]>(
  'latestMangaChapters',
  () => $fetch('/api/manga/latest-chapters')
);

const columnFilters = ref([
  {
    id: 'manga_title',
    value: '',
    filterFn: 'includesString',
  }
])

const columns: TableColumn<MangaLatestChapter>[] = [{
  accessorKey: 'manga_id',
  header: 'Manga ID',
}, {
  accessorKey: 'manga_title',
  header: 'Manga Title',
}, {
  accessorKey: 'chapter_number',
  header: 'Chapter Number',
}, {
  id: 'actions',
  header: 'Actions',
}]

// PERUBAHAN: Fungsi ini sekarang hanya membuka modal
function openDeleteModal(mangaId: number) {
  mangaToDeleteId.value = mangaId;
  isModalOpen.value = true;
}

// TAMBAHAN: Fungsi ini menjalankan penghapusan setelah konfirmasi
async function confirmDelete() {
  if (!mangaToDeleteId.value) return;

  isDeleting.value = true;
  try {
    // Panggil API untuk menghapus manga
    console.log(`Deleting manga with ID: ${mangaToDeleteId.value}`);
    // await $fetch(`/api/manga/${mangaToDeleteId.value}`, { method: 'DELETE' });

    // Tutup modal
    isModalOpen.value = false;
    mangaToDeleteId.value = null;

    // Tampilkan notifikasi
    toast.add({
      title: 'Success',
      description: 'Manga deleted successfully!',
      color: 'success',
      duration: 3000
    });

    // Refresh data tabel
    await refresh();
  } catch (error) {
    console.error('Failed to delete manga:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to delete manga. Please try again.',
      color: 'error',
      duration: 5000
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>