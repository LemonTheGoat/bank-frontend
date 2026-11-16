<script setup>
import { computed } from 'vue';
import Decimal from 'decimal.js';
import {
  ChevronsUpDown, ClipboardList, LayoutDashboard, ArrowLeftRight, CreditCard,
  FileText, Landmark, Search, Settings, ShieldCheck, UserCheck
} from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

/* -------------------------------------------------------------------------- */
/*  State & Store Configuration                                               */
/* -------------------------------------------------------------------------- */
const accountStore = useAccountStore();

const user = computed(() => accountStore.user);
const fullName = computed(() => `${user.value.first_name} ${user.value.last_name}`);
const initials = computed(() => `${user.value.first_name[0]}${user.value.last_name[0]}`);

/* -------------------------------------------------------------------------- */
/*  Formatting & KPI Logic                                                    */
/* -------------------------------------------------------------------------- */
const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

const totalLiquidity = computed(() =>
  accountStore.customers.reduce((sum, customer) => sum.plus(customer.balance), new Decimal(0))
);

const activeCustomerCount = computed(() =>
  accountStore.customers.filter((customer) => customer.status === 'Active').length
);

const kpis = computed(() => [
  { label: 'Total Bank Liquidity', value: phpFormatter.format(totalLiquidity.value.toNumber()), icon: Landmark, color: 'text-emerald-500' },
  { label: 'Active Customers', value: activeCustomerCount.value, icon: UserCheck, color: 'text-blue-400' },
  { label: 'Pending Approvals', value: accountStore.pendingApprovals.length, icon: ClipboardList, color: 'text-amber-400' },
]);

/* -------------------------------------------------------------------------- */
/*  Static UI Config                                                          */
/* -------------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { id: 'cards', label: 'Cards', icon: CreditCard, to: '/dashboard' },
  { id: 'history', label: 'Transactions', icon: ArrowLeftRight, to: '/dashboard' },
  { id: 'loans', label: 'Loan Details', icon: FileText, to: '/dashboard' },
];

const CARD_CLASS = 'rounded-2xl border border-slate-700/60 bg-slate-800';
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
</script>

<template>
  <div class="flex min-h-screen bg-slate-900 font-sans text-slate-100 antialiased overflow-x-hidden">

    <!-- ================= SIDEBAR ================= -->
    <aside class="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-slate-800 p-4 lg:block xl:w-60">
      <div class="flex h-full flex-col">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 text-emerald-500" />
            <span class="text-sm font-bold tracking-tight text-white">SecureBank</span>
          </div>
          <button type="button" :class="`flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-slate-800 ${FOCUS_RING}`">
            <span class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-[11px] font-semibold text-emerald-500 ring-1 ring-emerald-500/30">
              {{ initials }}
            </span>
            <ChevronsUpDown aria-hidden="true" class="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>

        <label class="relative mt-5 block">
          <span class="sr-only">Search</span>
          <Search aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search" class="w-full rounded-lg border border-slate-800 bg-slate-800/60 py-2 pl-9 pr-8 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <kbd aria-hidden="true" class="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">/</kbd>
        </label>

        <nav aria-label="Primary" class="mt-5">
          <ul class="space-y-1">
            <li v-for="item in NAV_ITEMS" :key="item.id">
              <NuxtLink :to="item.to" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} text-slate-400 hover:bg-slate-800/60 hover:text-white`">
                <component :is="item.icon" aria-hidden="true" class="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300" />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="mt-auto pt-6">
          <ul class="space-y-1">
            <li>
              <NuxtLink to="/admin" aria-current="page" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-slate-800 text-white ${FOCUS_RING}`">
                <span aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"></span>
                <Settings aria-hidden="true" class="h-4 w-4 shrink-0 text-emerald-500" />
                Admin Console
              </NuxtLink>
            </li>
          </ul>
          <div class="mt-3 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2.5">
            <p class="truncate text-sm font-medium text-white">{{ fullName }}</p>
            <p class="truncate text-xs text-slate-400">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Mobile Top Bar -->
      <div class="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 lg:hidden">
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-5 w-5 text-emerald-500" />
          <span class="text-sm font-bold tracking-tight text-white">SecureBank</span>
        </div>
        <nav aria-label="Primary" class="flex gap-4 overflow-x-auto text-xs font-medium">
          <NuxtLink v-for="item in NAV_ITEMS" :key="item.id" :to="item.to" class="whitespace-nowrap text-slate-400 hover:text-white">{{ item.label }}</NuxtLink>
          <NuxtLink to="/admin" class="whitespace-nowrap text-white">Admin Console</NuxtLink>
        </nav>
      </div>

      <!-- Fluid Width Main Container -->
      <main class="flex w-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        <div class="animate-fade-slide flex flex-1 flex-col gap-6">

          <!-- KPI Cards -->
          <div class="grid gap-4 md:grid-cols-3">
            <section v-for="kpi in kpis" :key="kpi.label" :class="`${CARD_CLASS} flex items-center gap-4 p-5 shadow-lg`">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900/60">
                <component :is="kpi.icon" aria-hidden="true" :class="`h-5 w-5 ${kpi.color}`" />
              </span>
              <div class="min-w-0">
                <p class="text-[10px] uppercase tracking-wider text-slate-400">{{ kpi.label }}</p>
                <p class="mt-0.5 truncate font-mono text-lg font-bold text-white">{{ kpi.value }}</p>
              </div>
            </section>
          </div>

          <!-- Admin Console: customers table & approvals queue -->
          <Admin />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-slide {
  animation: fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
