<template>
  <div class="py-6 px-2 flex flex-col items-center dark:bg-zinc-800">
    <!-- LOGO -->
    <NuxtLink to="/" class="min-lg:flex hidden font-[Boldonse] text-xl flex-col items-end mb-5">Alterkai<span
        class="text-xs">Scans</span></NuxtLink>

    <!-- SIDEBAR ITEMS -->
    <ul class="flex flex-col gap-2 w-full">
      <li v-for="(item, index) in props.items" :key="index"
        class="p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
        <NuxtLink :to="item.to" class="flex items-center gap-2 w-full">
          <UIcon v-if="item.icon" :name="item.icon" class="size-5" />
          <span class="font-semibold">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface SidebarItem {
  to: string
  label: string
  icon?: string
}

const props = defineProps<{
  items: SidebarItem[]
}>()

</script>