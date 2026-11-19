<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { theme, initTheme } = useTheme();
initTheme();
useHead({
  htmlAttrs: {
    class: computed(() => (theme.value === 'dark' ? 'dark' : ''))
  }
});

// Tabs share one mounted track, so switching between them must not trigger any route transition
const MOBILE_TABS = ['/mobile', '/mobile/cards', '/mobile/loans'];
const isMobileTabSwitch = ref(false);

watch(() => route.path, (to, from) => {
  isMobileTabSwitch.value = MOBILE_TABS.includes(to) && MOBILE_TABS.includes(from);
}, { flush: 'sync' });

const pageTransition = computed(() =>
  isMobileTabSwitch.value ? false : { name: 'page', mode: 'out-in' }
);
</script>

<template>
  <div class="relative min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 overflow-x-clip dark:bg-slate-950 dark:text-slate-100">
    <!-- NuxtLayout applies the layout declared by each page (e.g. 'mobile'); pages without one render as-is -->
    <NuxtLayout>
      <!-- NuxtPage acts as a window that automatically shows whatever page you navigate to -->
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </div>
</template>

<style>
/* Nuxt uses these specific class names automatically for page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
