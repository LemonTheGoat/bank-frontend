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

/* Keep Outfit and aligned numbers for the desktop component's monospace figures */
.mobile-embed :deep(.font-mono) {
  font-family: 'Outfit', sans-serif;
  font-variant-numeric: tabular-nums;
}

/* Frosted, softer surfaces and tactile tap feedback without editing Cards.vue */
.mobile-embed :deep(.bg-slate-800) {
  background-color: rgb(15 23 42 / 0.6);
  backdrop-filter: blur(12px);
  border-color: rgb(255 255 255 / 0.07);
}
.mobile-embed :deep(.rounded-\[2rem\]) {
  border-radius: 1rem;
}
.mobile-embed :deep(button) {
  transition: transform 200ms ease, background-color 200ms ease, color 200ms ease;
}
.mobile-embed :deep(button:active) {
  transform: scale(0.98);
}
</style>
