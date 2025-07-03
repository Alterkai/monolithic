<template>
  <footer class="flex flex-col gap-10 container py-10">

    <!-- TOP LINE -->
    <div class="flex flex-col md:max-2xl:flex-row md:max-2xl:justify-between gap-10">
      <!-- LOGO -->
      <div class="flex flex-col">
        <div class="flex flex-row items-baseline gap-1">
          <h1 class="font-bold text-3xl">Alterkai</h1>
          <p class="font-semibold text-primary">v2</p>
        </div>
        <p>Suka komik aneh? Alterkai tempatnya.</p>
      </div>

      <div class="flex flex-row gap-20">
        <!-- LINKS -->
        <div class="flex flex-col">
          <h2 class="font-semibold text-xl">Links</h2>
          <ULink to="/">Home</ULink>
          <ULink to="/manga">Manga</ULink>
          <ULink to="/blog">Blog</ULink>
          <ULink to="https://academy.alterkaiscans.my.id" target="_blank">Academy</ULink>
        </div>

        <!-- SOCIALS -->
        <div class="flex flex-col">
          <h2 class="font-semibold text-xl">Socials</h2>
          <ULink to="https://trakteer.id/faralha" target="_blank">Trakteer</ULink>
          <ULink to="https://facebook.com/alterkaiscans">Facebook</ULink>
          <ULink to="https://bit.ly/alterkai" target="_blank">Discord</ULink>
        </div>

        <!-- LEGALS -->
         <div class="flex flex-col">
          <h2 class="font-semibold text-xl">Legal</h2>
          <ULink to="/terms">Terms of Service</ULink>
          <ULink to="/privacy">Privacy Policy</ULink>
          <ULink to="/dmca">DMCA</ULink>
          <ULink to="/disclaimer">Disclaimer</ULink>
         </div>
      </div>
    </div>

    <!-- BOTTOM LINE -->
    <div class="flex flex-col">
      <USeparator />
      <div class="mt-3">
        <p class="text-sm text-neutral-500">© 2025 Alterkai. All rights reserved.</p>
        <p class="text-sm text-neutral-500">Made with ❤️ by
          <ULink to="https://github.com/faralha" target="_blank">
            Faralha
          </ULink>
        </p>
      </div>
    </div>
  </footer>
</template>