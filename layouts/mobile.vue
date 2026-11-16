<script setup>
import { useRoute } from 'vue-router';
import { CreditCard, FileText, Home, ShieldCheck } from 'lucide-vue-next';

const route = useRoute();

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

const TABS = [
  { id: 'home', label: 'Home', icon: Home, to: '/mobile' },
  { id: 'cards', label: 'Cards', icon: CreditCard, to: '/mobile/cards' },
  { id: 'loans', label: 'Loans', icon: FileText, to: '/mobile/loans' },
];

const isActive = (to) => route.path === to;
</script>

<template>
  <div class="min-h-screen bg-slate-900 font-sans text-slate-100 antialiased">
    <div class="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-slate-800 bg-slate-950">

      <!-- ================= HEADER ================= -->
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <div class="flex items-center gap-2">
          <ShieldCheck aria-hidden="true" class="h-5 w-5 text-emerald-500" />
          <span class="text-sm font-bold tracking-tight text-white">SecureBank Mobile</span>
        </div>
        <NuxtLink
          to="/dashboard"
          :class="`rounded-sm text-[11px] text-slate-500 transition-colors hover:text-slate-300 ${FOCUS_RING}`"
        >
          Web Portal
        </NuxtLink>
      </header>

      <!-- ================= CONTENT ================= -->
      <main class="flex flex-1 flex-col overflow-y-auto p-4 pb-28">
        <slot />
      </main>

      <!-- ================= BOTTOM NAV ================= -->
      <nav
        aria-label="Mobile primary"
        class="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-800 bg-slate-950/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <ul class="grid grid-cols-3">
          <li v-for="tab in TABS" :key="tab.id">
            <NuxtLink
              :to="tab.to"
              :aria-current="isActive(tab.to) ? 'page' : undefined"
              :class="`group relative flex flex-col items-center gap-1 rounded-lg py-3 text-[11px] font-medium transition-colors ${FOCUS_RING} ${isActive(tab.to) ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`"
            >
              <span v-if="isActive(tab.to)" aria-hidden="true" class="absolute inset-x-6 top-0 h-0.5 rounded-full bg-emerald-500"></span>
              <component
                :is="tab.icon"
                aria-hidden="true"
                :class="`h-5 w-5 transition-colors ${isActive(tab.to) ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`"
              />
              {{ tab.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
