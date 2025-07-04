<template>
  <NuxtLink to="/manga/30">
    <div class="w-full relative">
      <NuxtImg :src="image" class="absolute inset-0 w-full h-[20rem] object-cover z-0" />
      <div class="z-50">
        <div class="absolute flex flex-row justify-start items-end h-[20rem] w-full">

          <div class="flex flex-row justify-start items-end w-full min-h-[35%]">
            <!-- TITLE, DESC -->
            <div class="bg-current p-4 px-[2rem] w-[60%] h-full">
              <h1 class="text-(--ui-bg) text-3xl font-bold line-clamp-2">{{ title }}</h1>

              <div class="flex flex-row gap-2 mt-2">
                <div v-for="genre in genres" class="text-(--ui-bg) outline outline-(--ui-bg) p-1 text-sm">
                  {{ genre }} 
                </div>
              </div>
            </div>

            <div class="w-[40%] h-full">
              <!-- CHAPTER, CTA BUTTON -->
              <div class="bg-primary p-3 h-full text-slate-950">
                Latest Chapter: #53
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  genres: {
    type: Array,
  }
})
</script>