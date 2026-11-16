<script setup>
definePageMeta({ layout: 'mobile' });
</script>

<template>
  <div class="mobile-embed flex w-full flex-col">
    <Cards />
  </div>
</template>

<style scoped>
/* Cards.vue is designed for desktop breakpoints; keep its grids single-column inside the phone frame. */
.mobile-embed :deep([class*="md:grid-cols"]),
.mobile-embed :deep([class*="lg:grid-cols"]),
.mobile-embed :deep([class*="xl:grid-cols"]) {
  grid-template-columns: minmax(0, 1fr) !important;
}
.mobile-embed :deep([class*="col-span-"]) {
  grid-column: auto !important;
}
</style>
