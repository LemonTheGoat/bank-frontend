<script setup>
import { ref, computed } from 'vue';
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Banknote, ChevronDown,
  ChevronsUpDown, CreditCard, FileText, LayoutDashboard, LifeBuoy, Menu,
  Search, Settings, ShieldCheck, X
} from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

/* -------------------------------------------------------------------------- */
/*  State & Store Configuration                                               */
/* -------------------------------------------------------------------------- */
const accountStore = useAccountStore();

const currentView = ref('dashboard');
const navOpen = ref(false);
const modalOpen = ref(false);
const activeTab = ref('all');
const query = ref('');

const user = computed(() => accountStore.user);
const account = computed(() => accountStore.account);
const loan = computed(() => accountStore.loan);
const transactions = computed(() => accountStore.transactions);

const fullName = computed(() => `${user.value.first_name} ${user.value.last_name}`);
const initials = computed(() => `${user.value.first_name[0]}${user.value.last_name[0]}`);

/* -------------------------------------------------------------------------- */
/*  Formatting Helpers                                                        */
/* -------------------------------------------------------------------------- */
const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const signedPhpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', signDisplay: 'exceptZero' });
const dateFormatter = new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
const timeFormatter = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' });
const longDateFormatter = new Intl.DateTimeFormat('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatPHP = (value) => phpFormatter.format(Number(value));
const formatSignedPHP = (value) => signedPhpFormatter.format(Number(value));
const toTitleCase = (value) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const splitBigAmount = (value) => {
  const parts = phpFormatter.formatToParts(Number(value));
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? '';
  const rest = parts.filter((part) => part.type !== 'currency').map((part) => part.value).join('');
  return { symbol, rest };
};

/* -------------------------------------------------------------------------- */
/*  Static UI Config (Updated for Glassmorphism & Reduced Rounding)           */
/* -------------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'history', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'loans', label: 'Loan Details', icon: FileText },
];

const FOOTER_ITEMS = [
  { id: 'help', label: 'Help', icon: LifeBuoy },
  { id: 'admin', label: 'Admin Console', icon: Settings },
];

const TABS = [
  { id: 'all', label: 'Recent Transactions' },
  { id: 'transfer', label: 'Recent Transfers' },
];

const TYPE_META = {
  deposit: { label: 'Deposit', icon: ArrowDownLeft },
  transfer: { label: 'Transfer', icon: ArrowUpRight },
  loan_repayment: { label: 'Loan Repayment', icon: Banknote },
};

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};
const DEFAULT_STATUS_STYLE = 'bg-white/5 text-slate-300 border border-white/10';

// Reduced rounding from 2xl to xl, added liquid glass effects
const CARD_CLASS = 'rounded-xl border border-white/10 bg-slate-900/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl'; 
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50';
// Updated to match the glowing login button, but reduced rounding to lg
const PRIMARY_BUTTON = `rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] ${FOCUS_RING}`;
const TH_CLASS = 'bg-white/5 px-4 py-3 text-xs font-medium text-white/70 border-b border-white/10 first:rounded-tl-xl last:rounded-tr-xl';

/* -------------------------------------------------------------------------- */
/*  Computed Data Logic                                                       */
/* -------------------------------------------------------------------------- */
const paidDownPct = computed(() => {
  const originalLoan = Number(loan.value.loan_amount);
  const remainingLoan = Number(loan.value.remaining_balance);
  return originalLoan > 0 ? Math.min(100, Math.max(0, (1 - remainingLoan / originalLoan) * 100)) : 0;
});

const recentTransactions = computed(() => {
  return [...transactions.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const visibleTransactions = computed(() => {
  const needle = query.value.trim().toLowerCase();
  return recentTransactions.value.filter(
    (tx) => (activeTab.value === 'all' || tx.type === activeTab.value) &&
            tx.description.toLowerCase().includes(needle)
  );
});

const getMeta = (type) => TYPE_META[type] ?? { label: toTitleCase(type), icon: ArrowLeftRight };
const isCredit = (amount) => Number(amount) > 0;
</script>

<template>
  <!-- Base layout matching index.vue background -->
  <div class="relative min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-emerald-500/30 overflow-x-hidden">
    
    <!-- ================= DYNAMIC GLOWING BACKGROUND ================= -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <!-- Top Left Emerald Glow -->
      <div class="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-600/10 blur-[120px]"></div>
      <!-- Bottom Right Deep Blue Glow -->
      <div class="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/10 blur-[150px]"></div>
      <!-- Center Ambient Cyan Glow -->
      <div class="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-900/10 blur-[120px]"></div>
    </div>
    
    <!-- Foreground Wrapper -->
    <div class="relative z-10 flex min-h-screen">
      
      <!-- ================= SIDEBAR (GLASSMORPHISM) ================= -->
      <aside class="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-white/10 bg-white/[0.02] backdrop-blur-2xl p-4 lg:block xl:w-60">
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-5 w-5 text-emerald-400" />
              <span class="text-sm font-bold tracking-tight text-white drop-shadow-md">SecureBank</span>
            </div>
            <button type="button" :class="`flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-white/10 ${FOCUS_RING}`">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                {{ initials }}
              </span>
              <ChevronsUpDown aria-hidden="true" class="h-3.5 w-3.5 text-white/50" />
            </button>
          </div>

          <label class="relative mt-5 block">
            <span class="sr-only">Search</span>
            <Search aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input type="text" placeholder="Search" class="w-full rounded-lg border border-white/10 bg-slate-950/60 py-2 pl-9 pr-8 text-xs text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
            <kbd aria-hidden="true" class="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">/</kbd>
          </label>

          <nav aria-label="Primary" class="mt-5">
            <ul class="space-y-1">
              <li v-for="item in NAV_ITEMS" :key="item.id">
                <a href="#" @click.prevent="currentView = item.id; navOpen = false" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${currentView === item.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`">
                  <span v-if="currentView === item.id" aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400"></span>
                  <component :is="item.icon" aria-hidden="true" :class="`h-4 w-4 shrink-0 transition-colors ${currentView === item.id ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/70'}`" />
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="mt-auto pt-6">
            <ul class="space-y-1">
              <li v-for="item in FOOTER_ITEMS" :key="item.id">
                <a href="#" @click.prevent="currentView = item.id; navOpen = false" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${currentView === item.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`">
                  <span v-if="currentView === item.id" aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400"></span>
                  <component :is="item.icon" aria-hidden="true" :class="`h-4 w-4 shrink-0 transition-colors ${currentView === item.id ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/70'}`" />
                  {{ item.label }}
                </a>
              </li>
            </ul>
            <div class="mt-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5">
              <p class="truncate text-sm font-medium text-white">{{ fullName }}</p>
              <p class="truncate text-xs text-white/50">{{ user.email }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex min-w-0 flex-1 flex-col">
        
        <!-- Mobile Top Bar -->
        <div class="flex items-center justify-between border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl px-4 py-3 lg:hidden">
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 text-emerald-400" />
            <span class="text-sm font-bold tracking-tight text-white drop-shadow-md">SecureBank</span>
          </div>
          <button type="button" @click="navOpen = true" class="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Menu class="h-5 w-5" />
          </button>
        </div>

       <main class="flex w-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-10">
          <div :key="currentView" class="animate-fade-slide flex flex-1 flex-col gap-4">
            
            <!-- ================= DASHBOARD VIEW ================= -->
            <template v-if="currentView === 'dashboard'">
              <header class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 class="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Hey, {{ user.first_name }}</h1>
                  <p class="mt-0.5 text-xs text-white/50">{{ longDateFormatter.format(new Date()) }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                    This month <ChevronDown class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" :class="PRIMARY_BUTTON" @click="modalOpen = true">Move money</button>
                </div>
              </header>

              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                
                <!-- Balance Card -->
                <section :class="`${CARD_CLASS} flex flex-col p-6 xl:col-span-2 relative overflow-hidden`">
                  <!-- Subtle corner dot pattern -->
                  <div class="absolute right-0 top-0 -z-10 h-32 w-32 opacity-20" style="background-image: radial-gradient(rgba(16, 185, 129, 0.4) 1.5px, transparent 1.5px); background-size: 16px 16px; mask-image: radial-gradient(circle, black, transparent);"></div>
                  
                  <div class="flex items-start justify-between gap-3">
                    <h2 class="text-sm font-medium text-white/70">Balance</h2>
                    <button type="button" :class="PRIMARY_BUTTON" @click="modalOpen = true">Move money</button>
                  </div>
                  
                  <div class="mt-4">
                    <p class="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      <span class="mr-1 text-2xl font-medium text-white/50 sm:text-3xl">{{ splitBigAmount(account.balance).symbol }}</span>
                      {{ splitBigAmount(account.balance).rest }}
                    </p>
                  </div>

                  <div class="mt-auto pt-10">
                    <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-5 xl:grid-cols-4">
                      <div class="min-w-0">
                        <dt class="text-xs text-white/50">Account holder</dt>
                        <dd class="mt-1 truncate text-sm font-medium text-white">{{ fullName }}</dd>
                      </div>
                      <div class="min-w-0">
                        <dt class="text-xs text-white/50">Account number</dt>
                        <dd class="mt-1 break-words font-mono text-sm font-medium text-white">{{ account.account_number }}</dd>
                      </div>
                      <div class="min-w-0">
                        <dt class="text-xs text-white/50">Account type</dt>
                        <dd class="mt-1 text-sm font-medium text-white">{{ toTitleCase(account.account_type) }}</dd>
                      </div>
                      <div class="min-w-0">
                        <dt class="text-xs text-white/50">Status</dt>
                        <dd class="mt-1">
                          <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[account.status] ?? DEFAULT_STATUS_STYLE}`">
                            <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {{ toTitleCase(account.status) }}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <!-- Loan Summary Card -->
                <section :class="`${CARD_CLASS} flex flex-col p-6`">
                  <div class="flex items-center justify-between gap-3">
                    <h2 class="text-sm font-medium text-white/70">Loan Summary</h2>
                    <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[loan.status] ?? DEFAULT_STATUS_STYLE}`">
                      <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                      {{ toTitleCase(loan.status) }}
                    </span>
                  </div>
                  <div class="mt-4">
                    <p class="mb-1 text-xs text-white/50">Remaining balance</p>
                    <p class="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      <span class="mr-1 text-xl font-medium text-white/50 sm:text-2xl">{{ splitBigAmount(loan.remaining_balance).symbol }}</span>
                      {{ splitBigAmount(loan.remaining_balance).rest }}
                    </p>
                  </div>
                  <div class="mt-6">
                    <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div class="h-full rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" :style="`width: ${paidDownPct}%`"></div>
                    </div>
                    <p class="mt-2 text-xs text-white/50">
                      <span class="font-mono text-emerald-400">{{ paidDownPct.toFixed(1) }}%</span> paid down
                    </p>
                  </div>
                  <dl class="mt-auto divide-y divide-white/10 pt-6 text-sm">
                    <div class="flex items-center justify-between gap-4 py-2.5">
                      <dt class="text-white/50">Original amount</dt>
                      <dd class="font-mono font-medium text-white">{{ formatPHP(loan.loan_amount) }}</dd>
                    </div>
                    <div class="flex items-center justify-between gap-4 py-2.5">
                      <dt class="text-white/50">Interest rate</dt>
                      <dd class="font-mono font-medium text-white">{{ loan.interest_rate }}%</dd>
                    </div>
                    <div class="flex items-center justify-between gap-4 pt-2.5">
                      <dt class="text-white/50">Term</dt>
                      <dd class="font-mono font-medium text-white">{{ loan.term_months }} months</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <!-- Recent Transactions Table -->
              <section :class="`${CARD_CLASS} flex flex-1 flex-col p-6`">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div class="flex gap-6 border-b border-white/10 w-full sm:w-auto">
                    <button v-for="tab in TABS" :key="tab.id" type="button" @click="activeTab = tab.id" :class="`relative pb-3 text-sm font-medium transition-colors ${FOCUS_RING} ${tab.id === activeTab ? 'text-white' : 'text-white/50 hover:text-white/80'}`">
                      {{ tab.label }}
                      <span v-if="tab.id === activeTab" class="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-emerald-400 shadow-[0_-2px_10px_rgba(52,211,153,0.5)]"></span>
                    </button>
                  </div>
                  <label class="relative block sm:w-64">
                    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input type="text" v-model="query" placeholder="Search transactions" class="w-full rounded-lg border border-white/10 bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                  </label>
                </div>

                <div class="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/20">
                  <table class="w-full min-w-[760px] border-separate border-spacing-0">
                    <thead>
                      <tr>
                        <th :class="`${TH_CLASS} text-left`">Description</th>
                        <th :class="`${TH_CLASS} text-left`">Type</th>
                        <th :class="`${TH_CLASS} text-left`">Date &amp; time</th>
                        <th :class="`${TH_CLASS} text-left`">Status</th>
                        <th :class="`${TH_CLASS} text-right pr-6`">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="visibleTransactions.length === 0">
                        <td colspan="5" class="px-4 py-10 text-center text-sm text-white/50">No transactions match your search.</td>
                      </tr>
                      
                      <tr v-for="tx in visibleTransactions" :key="tx.id" class="transition-colors last:[&>td]:border-b-0 hover:bg-white/5">
                        <td class="border-b border-white/5 px-4 py-4">
                          <div class="flex items-center gap-3">
                            <span :class="`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${isCredit(tx.amount) ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-white/70'}`">
                              <component :is="getMeta(tx.type).icon" class="h-4 w-4" />
                            </span>
                            <div class="min-w-0">
                              <p class="text-sm font-medium text-white">{{ tx.description }}</p>
                              <p class="font-mono text-xs text-white/40">#{{ tx.id }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="border-b border-white/5 px-4 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70">
                            {{ getMeta(tx.type).label }}
                          </span>
                        </td>
                        <td class="border-b border-white/5 px-4 py-4 whitespace-nowrap font-mono text-xs">
                          <span class="text-white/90">{{ dateFormatter.format(new Date(tx.created_at)) }}</span>
                          <span class="text-white/40">, {{ timeFormatter.format(new Date(tx.created_at)) }}</span>
                        </td>
                        <td class="border-b border-white/5 px-4 py-4 whitespace-nowrap">
                          <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[tx.status] ?? DEFAULT_STATUS_STYLE}`">
                            <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {{ toTitleCase(tx.status) }}
                          </span>
                        </td>
                        <td :class="`border-b border-white/5 px-4 py-4 whitespace-nowrap pr-6 text-right font-mono text-sm font-semibold tabular-nums ${isCredit(tx.amount) ? 'text-emerald-400' : 'text-white'}`">
                          {{ formatSignedPHP(tx.amount) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </template>

            <!-- Dynamic Sub-Views -->
            <History v-if="currentView === 'history'" />
            <Cards v-if="currentView === 'cards'" />
            <Loans v-if="currentView === 'loans'" />
            <Admin v-if="currentView === 'admin'" />

          </div>
        </main>
      </div>
    </div>
    
    <TransferModal :is-open="modalOpen" @close="modalOpen = false" :current-balance="account.balance" />
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