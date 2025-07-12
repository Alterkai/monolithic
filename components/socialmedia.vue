<template>
  <div class="flex gap-2">
    <div class="">
      <NuxtLink to="http://discord.com/invite/kCQ9c6p" target="_blank">
        <NuxtImg class="icon" src="assets/icons/discord.png" />
      </NuxtLink>
    </div>

    <div class="">
      <NuxtLink to="http://trakteer.id/faralha" target="_blank">
        <NuxtImg class="icon" src="assets/icons/trakteer.png" />
      </NuxtLink>
    </div>

    <div class="">
      <NuxtLink to="http://facebook.com/alterkaiscans" target="_blank">
        <NuxtImg class="icon" src="assets/icons/facebook.png" />
      </NuxtLink>
    </div>
  </div>
</template>

<style>
.icon {
  width: 5rem;
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.1);
}
</style>