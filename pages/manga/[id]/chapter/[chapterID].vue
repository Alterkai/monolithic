<template>
  <div class="container">
    <p>You are reading {{ route.params.chapterID }} from manga {{ route.params.id }}</p>
  
    <CommentsContainer :manga_id="mangaID" :chapter_id="parseInt(chapterID)" />
  </div>
</template>

<script setup lang="ts">
import { CommentsContainer } from '#components';

const route = useRoute();
const mangaID = route.params.id as string;
const chapterID = route.params.chapterID as string;
</script>