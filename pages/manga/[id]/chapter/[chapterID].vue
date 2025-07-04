<template>
  <div class="container">
    <p>You are reading {{ route.params.chapterID }} from manga {{ route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
</script>