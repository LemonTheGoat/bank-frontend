<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CreditCard, FileText, Home, Moon, ShieldCheck, Sun } from 'lucide-vue-next';

const route = useRoute();
const { theme, toggleTheme, syncFromDocument } = useTheme();

onMounted(syncFromDocument);

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
const THEME_TOGGLE_CLASS = `flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:text-slate-900 active:scale-90 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300 dark:shadow-none dark:hover:text-white ${FOCUS_RING}`;

const TABS = [
  { id: 'home', label: 'Home', icon: Home, to: '/mobile' },
  { id: 'cards', label: 'Cards', icon: CreditCard, to: '/mobile/cards' },
  { id: 'loans', label: 'Loans', icon: FileText, to: '/mobile/loans' },
];

const isDark = computed(() => theme.value === 'dark');
const isActive = (to) => route.path === to;
const activeIndex = computed(() => TABS.findIndex((tab) => isActive(tab.to)));
const trackIndex = computed(() => Math.max(activeIndex.value, 0));
</script>

<template>
  <div class="min-h-screen bg-slate-100 font-['Outfit',sans-serif] text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
    <div class="mobile-app relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-x-clip border-x border-slate-200 bg-slate-50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">

      <!-- ================= AMBIENT GLOW ================= -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div class="animate-lava-1 absolute -left-24 -top-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/[0.14]"></div>
        <div class="animate-lava-2 absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-400/[0.11]"></div>
        <div class="animate-lava-3 absolute left-1/2 top-1/2 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-400/[0.08]"></div>
      </div>

      <!-- ================= HEADER ================= -->
      <header class="relative z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/75 px-4 py-3 backdrop-blur-md transition-colors duration-300 dark:border-white/[0.07] dark:bg-slate-900/60">
        <div class="flex items-center gap-2">
          <ShieldCheck aria-hidden="true" class="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
          <span class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">SecureBank Mobile</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :class="THEME_TOGGLE_CLASS"
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
          <NuxtLink
            to="/dashboard"
            :class="`rounded-sm text-[11px] text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300 ${FOCUS_RING}`"
          >
            Web Portal
          </NuxtLink>
        </div>
      </header>

      <!-- ================= SCREEN TRACK ================= -->
      <!-- All three screens stay mounted side-by-side; the track slides between them -->
      <main class="relative z-10 min-h-0 flex-1 overflow-hidden">
        <div
          class="flex h-full w-[300%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :style="{ transform: `translateX(-${trackIndex * (100 / 3)}%)` }"
        >
          <section class="h-full w-1/3 shrink-0 overflow-y-auto overflow-x-hidden p-4 pb-28">
            <MobileHomeScreen />
          </section>
          <section class="h-full w-1/3 shrink-0 overflow-y-auto overflow-x-hidden p-4 pb-28">
            <MobileCardsScreen />
          </section>
          <section class="h-full w-1/3 shrink-0 overflow-y-auto overflow-x-hidden p-4 pb-28">
            <MobileLoansScreen />
          </section>
        </div>

        <!-- Route pages stay mounted as empty shells so /mobile, /mobile/cards, /mobile/loans still resolve -->
        <div class="hidden"><slot /></div>
      </main>

      <!-- ================= BOTTOM NAV ================= -->
      <!-- fixed already establishes the containing block for the absolute tracker -->
      <nav
        aria-label="Mobile primary"
        class="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 overflow-x-clip rounded-t-2xl border-t border-slate-200/80 bg-white/85 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,23,42,0.06)] backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-none"
      >
        <!-- Shared sliding tracker: glowing orb on the top edge over an emerald light pool -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-0 top-0 h-full w-1/3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="activeIndex < 0 ? 'opacity-0' : 'opacity-100'"
          :style="{ transform: `translateX(${trackIndex * 100}%)` }"
        >
          <!-- Glow layer clipped to the nav's rounded top corners -->
          <div class="absolute inset-0 overflow-hidden rounded-t-2xl">
            <div class="absolute left-1/2 top-0 h-16 w-24 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-xl dark:bg-emerald-500/30"></div>
            <div class="absolute left-1/2 top-0 h-10 w-14 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-md"></div>
          </div>
          <!-- Orb sits on the top border, outside the clip so it isn't cut off -->
          <span class="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.95)]"></span>
        </div>

        <ul class="grid grid-cols-3">
          <li v-for="tab in TABS" :key="tab.id">
            <NuxtLink
              :to="tab.to"
              :aria-current="isActive(tab.to) ? 'page' : undefined"
              :class="`group flex flex-col items-center gap-1 rounded-lg py-3 text-[11px] font-medium transition-all duration-200 ${FOCUS_RING} ${isActive(tab.to) ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`"
            >
              <component
                :is="tab.icon"
                aria-hidden="true"
                :class="`h-5 w-5 transition-all duration-200 ${isActive(tab.to) ? 'text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.75)] dark:text-emerald-500' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`"
              />
              {{ tab.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Mobile modals render here so they inherit the Outfit font from the phone frame -->
      <div id="mobile-modal-root"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-lava-1 {
  animation: lava-1 14s ease-in-out infinite alternate;
}
.animate-lava-2 {
  animation: lava-2 18s ease-in-out infinite alternate;
}
.animate-lava-3 {
  animation: lava-3 22s ease-in-out infinite alternate;
}

/* Emerald core: top-left drifting toward center-right */
@keyframes lava-1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(90px, 60px, 0) scale(1.1); }
  66% { transform: translate3d(160px, 150px, 0) scale(0.92); }
  100% { transform: translate3d(200px, 220px, 0) scale(1.05); }
}

/* Teal accent: bottom-right drifting up toward center-left */
@keyframes lava-2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(-80px, -70px, 0) scale(0.9); }
  66% { transform: translate3d(-150px, -160px, 0) scale(1.12); }
  100% { transform: translate3d(-200px, -210px, 0) scale(1); }
}

/* Mint undertone: morphs through the middle of the screen */
@keyframes lava-3 {
  0% { transform: translate3d(-50%, -50%, 0) scale(0.85); }
  33% { transform: translate3d(-40%, -60%, 0) scale(1.2); }
  66% { transform: translate3d(-60%, -40%, 0) scale(0.85); }
  100% { transform: translate3d(-50%, -50%, 0) scale(1.2); }
}
</style>
