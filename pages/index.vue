<template>
  <div class="h-screen w-screen container">
    <Herocard 
      v-for="manga in dummyData"
      :key="manga.title"
      :title="manga.title"
      :description="manga.description"
      :image="manga.image"
      :genres="manga.genres"
    />
</div>
</template>

<script setup lang="ts">

const dummyData = ref([
  {
    title: 'My Food Looks Very Cute',
    description: 'A vampire who has been sleeping for nearly two hundred years, Maria is awakened by a passing werewolf girl by a chance, and the moment the coffin is opened, the curse falls on the werewolf girl. The two girls set foot on the journey to the city',
    image: 'https://meo.comick.pictures/d0XGxK-m.jpg',
    genres: ['Action', 'Adventure', 'Comedy']
  },
  // {
  //   title: 'Another Dummy Manga',
  //   description: 'This is a description of another dummy manga.',
  //   image: 'https://example.com/dummy-image.jpg',
  //   genres: ['Fantasy', 'Drama']
  // }
]); 

</script>