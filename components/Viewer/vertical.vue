<template>
  <div v-for="item in props.data" :key="item.order">
    <NuxtImg :src="item.link" class="max-w-full" width="100%" height="auto" preload :alt="`Image ${item.order}`" />
  </div>
</template>

<script setup lang="ts">
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
})
</script>