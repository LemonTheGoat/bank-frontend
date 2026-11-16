<script setup>
definePageMeta({ layout: 'mobile' });
</script>

<template>
  <div class="mobile-embed flex w-full flex-col">
    <Loans />
  </div>
</template>

<style scoped>
/* Loans.vue is designed for desktop breakpoints; keep its grids inside the phone frame. */
.mobile-embed :deep([class*="md:grid-cols"]),
.mobile-embed :deep([class*="lg:grid-cols"]),
.mobile-embed :deep([class*="xl:grid-cols"]) {
  grid-template-columns: minmax(0, 1fr) !important;
}
.mobile-embed :deep([class*="sm:grid-cols-4"]) {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}
.mobile-embed :deep([class*="col-span-"]) {
  grid-column: auto !important;
}
</style>
