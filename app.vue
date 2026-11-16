<template>
  <div class="relative min-h-screen bg-[#020617] overflow-x-clip">
    <!-- NuxtLayout applies the layout declared by each page (e.g. 'mobile'); pages without one render as-is -->
    <NuxtLayout>
      <!-- NuxtPage acts as a window that automatically shows whatever page you navigate to -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Nuxt uses these specific class names automatically for page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>