<script setup>
import { computed, onMounted } from 'vue';
import { Moon, Sun } from 'lucide-vue-next';

const { theme, toggleTheme, syncFromDocument } = useTheme();

onMounted(syncFromDocument);

const isDark = computed(() => theme.value === 'dark');
const label = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'));
</script>

<template>
  <button
    type="button"
    @click="toggleTheme"
    :aria-label="label"
    :title="label"
    class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:text-slate-900 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:shadow-none dark:hover:text-white"
  >
    <span class="relative block h-3.5 w-3.5">
      <Sun
        aria-hidden="true"
        :class="`absolute inset-0 h-3.5 w-3.5 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`"
      />
      <Moon
        aria-hidden="true"
        :class="`absolute inset-0 h-3.5 w-3.5 transition-all duration-300 ${isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`"
      />
    </span>
  </button>
</template>
