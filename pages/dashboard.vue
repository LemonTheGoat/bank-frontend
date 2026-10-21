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
/*  Static UI Config (Original Solid Design)                                  */
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
  active: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
};
const DEFAULT_STATUS_STYLE = 'bg-slate-700/50 text-slate-300 ring-slate-600/50';

const CARD_CLASS = 'rounded-2xl border border-slate-700/60 bg-slate-800';
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
const PRIMARY_BUTTON = `rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200 ${FOCUS_RING}`;
const TH_CLASS = 'bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-400 first:rounded-l-lg last:rounded-r-lg';

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
              <a href="#" @click.prevent="currentView = item.id; navOpen = false" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${currentView === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`">
                <span v-if="currentView === item.id" aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"></span>
                <component :is="item.icon" aria-hidden="true" :class="`h-4 w-4 shrink-0 transition-colors ${currentView === item.id ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`" />
                {{ item.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="mt-auto pt-6">
          <ul class="space-y-1">
            <li v-for="item in FOOTER_ITEMS" :key="item.id">
              <a href="#" @click.prevent="currentView = item.id; navOpen = false" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${currentView === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`">
                <span v-if="currentView === item.id" aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"></span>
                <component :is="item.icon" aria-hidden="true" :class="`h-4 w-4 shrink-0 transition-colors ${currentView === item.id ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`" />
                {{ item.label }}
              </a>
            </li>
          </ul>
          <div class="mt-3 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2.5">
            <p class="truncate text-sm font-medium text-white">{{ fullName }}</p>
            <p class="truncate text-xs text-slate-400">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Navigation Drawer -->
    <div v-if="navOpen" role="dialog" aria-modal="true" aria-label="Navigation" class="fixed inset-0 z-40 flex lg:hidden">
      <aside class="h-full w-64 max-w-[80%] border-r border-slate-800 bg-slate-900 p-4">
        <!-- Re-used sidebar logic simplified for template -->
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-5 w-5 text-emerald-500" />
              <span class="text-sm font-bold tracking-tight text-white">SecureBank</span>
            </div>
            <button type="button" @click="navOpen = false" class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <X class="h-4 w-4" />
            </button>
          </div>
          <nav aria-label="Primary" class="mt-8">
            <ul class="space-y-1">
              <li v-for="item in NAV_ITEMS" :key="item.id">
                <a href="#" @click.prevent="currentView = item.id; navOpen = false" :class="`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${currentView === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`">
                  <span v-if="currentView === item.id" aria-hidden="true" class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"></span>
                  <component :is="item.icon" aria-hidden="true" :class="`h-4 w-4 shrink-0 transition-colors ${currentView === item.id ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`" />
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <button type="button" @click="navOpen = false" class="flex-1 bg-slate-950/70"></button>
    </div>

    <!-- Main Content Area -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Mobile Top Bar -->
      <div class="flex items-center justify-between border-b border-slate-800 px-4 py-3 lg:hidden">
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-5 w-5 text-emerald-500" />
          <span class="text-sm font-bold tracking-tight text-white">SecureBank</span>
        </div>
        <button type="button" @click="navOpen = true" class="rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
          <Menu class="h-5 w-5" />
        </button>
      </div>

      <!-- Fluid Width Main Container -->
      <main class="flex w-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        
        <div :key="currentView" class="animate-fade-slide flex flex-1 flex-col gap-4">
          
          <!-- ================= DASHBOARD VIEW ================= -->
          <template v-if="currentView === 'dashboard'">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 class="text-lg font-semibold text-white">Hey, {{ user.first_name }}</h1>
                <p class="mt-0.5 text-xs text-slate-400">{{ longDateFormatter.format(new Date()) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" :class="`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${FOCUS_RING}`">
                  This month <ChevronDown aria-hidden="true" class="h-3.5 w-3.5" />
                </button>
                <button type="button" :class="PRIMARY_BUTTON" @click="modalOpen = true">Move money</button>
              </div>
            </header>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <!-- Balance Card -->
              <section :class="`${CARD_CLASS} flex flex-col p-5 xl:col-span-2`">
                <div class="flex items-start justify-between gap-3">
                  <h2 class="text-sm font-medium text-slate-300">Balance</h2>
                  <button type="button" :class="PRIMARY_BUTTON" @click="modalOpen = true">Move money</button>
                </div>
                
                <div class="mt-3 py-4">
                  <p class="font-mono font-semibold tracking-tight text-white text-[clamp(2.5rem,5vw,6rem)] leading-none">
                    <span class="mr-2 font-medium text-slate-400 text-[clamp(1.5rem,3vw,4rem)]">{{ splitBigAmount(account.balance).symbol }}</span>
                    {{ splitBigAmount(account.balance).rest }}
                  </p>
                </div>

                <div class="mt-auto pt-8">
                  <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-700/60 pt-4 xl:grid-cols-4">
                    <div class="min-w-0">
                      <dt class="text-xs text-slate-400">Account holder</dt>
                      <dd class="mt-1 truncate text-sm font-medium text-white">{{ fullName }}</dd>
                    </div>
                    <div class="min-w-0">
                      <dt class="text-xs text-slate-400">Account number</dt>
                      <dd class="mt-1 break-words font-mono text-sm font-medium text-white">{{ account.account_number }}</dd>
                    </div>
                    <div class="min-w-0">
                      <dt class="text-xs text-slate-400">Account type</dt>
                      <dd class="mt-1 text-sm font-medium text-white">{{ toTitleCase(account.account_type) }}</dd>
                    </div>
                    <div class="min-w-0">
                      <dt class="text-xs text-slate-400">Status</dt>
                      <dd class="mt-1">
                        <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[account.status] ?? DEFAULT_STATUS_STYLE}`">
                          <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-current"></span>
                          {{ toTitleCase(account.status) }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              <!-- Loan Summary Card -->
              <section :class="`${CARD_CLASS} flex flex-col p-5`">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="text-sm font-medium text-slate-300">Loan Summary</h2>
                  <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[loan.status] ?? DEFAULT_STATUS_STYLE}`">
                    <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ toTitleCase(loan.status) }}
                  </span>
                </div>
                <div class="mt-3">
                  <p class="mb-1 text-xs text-slate-400">Remaining balance</p>
                  <p class="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    <span class="mr-1 text-xl font-medium text-slate-400 sm:text-2xl">{{ splitBigAmount(loan.remaining_balance).symbol }}</span>
                    {{ splitBigAmount(loan.remaining_balance).rest }}
                  </p>
                </div>
                <div class="mt-5">
                  <div role="progressbar" aria-label="Loan paid down" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(paidDownPct)" class="h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <div class="h-full rounded-full bg-emerald-500" :style="`width: ${paidDownPct}%`"></div>
                  </div>
                  <p class="mt-2 text-xs text-slate-400">
                    <span class="font-mono text-emerald-500">{{ paidDownPct.toFixed(1) }}%</span> paid down
                  </p>
                </div>
                <dl class="mt-auto divide-y divide-slate-700/50 pt-5 text-sm">
                  <div class="flex items-center justify-between gap-4 py-2">
                    <dt class="text-slate-400">Original amount</dt>
                    <dd class="font-mono font-medium text-white">{{ formatPHP(loan.loan_amount) }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4 py-2">
                    <dt class="text-slate-400">Interest rate</dt>
                    <dd class="font-mono font-medium text-white">{{ loan.interest_rate }}%</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4 pt-2">
                    <dt class="text-slate-400">Term</dt>
                    <dd class="font-mono font-medium text-white">{{ loan.term_months }} months</dd>
                  </div>
                </dl>
              </section>
            </div>

            <!-- Recent Transactions Table -->
            <section :class="`${CARD_CLASS} flex flex-1 flex-col p-5`">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div role="tablist" aria-label="Transaction views" class="flex gap-5">
                  <button v-for="tab in TABS" :key="tab.id" type="button" @click="activeTab = tab.id" :class="`relative rounded-sm pb-2.5 text-sm font-medium transition-colors ${FOCUS_RING} ${tab.id === activeTab ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`">
                    {{ tab.label }}
                    <span v-if="tab.id === activeTab" class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-500"></span>
                  </button>
                </div>
                <label class="relative block sm:w-64">
                  <Search class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input type="text" v-model="query" placeholder="Search transactions" class="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </label>
              </div>

              <div class="mt-4 overflow-x-auto">
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
                      <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-400">No transactions match your search.</td>
                    </tr>
                    
                    <tr v-for="tx in visibleTransactions" :key="tx.id" class="transition-colors last:[&>td]:border-b-0 hover:bg-slate-700/20">
                      <td class="border-b border-slate-700/50 px-4 py-3.5">
                        <div class="flex items-center gap-3">
                          <span :class="`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isCredit(tx.amount) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700/60 text-slate-300'}`">
                            <component :is="getMeta(tx.type).icon" class="h-4 w-4" />
                          </span>
                          <div class="min-w-0">
                            <p class="text-sm font-medium text-white">{{ tx.description }}</p>
                            <p class="font-mono text-xs text-slate-400">#{{ tx.id }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="border-b border-slate-700/50 px-4 py-3.5 whitespace-nowrap">
                        <span class="inline-flex items-center rounded-md bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                          {{ getMeta(tx.type).label }}
                        </span>
                      </td>
                      <td class="border-b border-slate-700/50 px-4 py-3.5 whitespace-nowrap font-mono text-xs">
                        <span class="text-slate-100">{{ dateFormatter.format(new Date(tx.created_at)) }}</span>
                        <span class="text-slate-400">, {{ timeFormatter.format(new Date(tx.created_at)) }}</span>
                      </td>
                      <td class="border-b border-slate-700/50 px-4 py-3.5 whitespace-nowrap">
                        <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[tx.status] ?? DEFAULT_STATUS_STYLE}`">
                          <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                          {{ toTitleCase(tx.status) }}
                        </span>
                      </td>
                      <td :class="`border-b border-slate-700/50 px-4 py-3.5 whitespace-nowrap pr-6 text-right font-mono text-sm font-semibold tabular-nums ${isCredit(tx.amount) ? 'text-emerald-500' : 'text-slate-100'}`">
                        {{ formatSignedPHP(tx.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </template>

          <!-- DYNAMIC SUB-VIEWS -->
          <History v-if="currentView === 'history'" />
          <Cards v-if="currentView === 'cards'" />
          <Loans v-if="currentView === 'loans'" />
          <Admin v-if="currentView === 'admin'" />

        </div>
      </main>
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