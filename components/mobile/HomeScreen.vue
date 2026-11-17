<script setup>
import { computed, reactive, ref } from 'vue';
import { ArrowDownLeft, ArrowDownToLine, ArrowUpRight, QrCode, Send, ShieldCheck } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

const accountStore = useAccountStore();

const transferOpen = ref(false);
const transferPrefill = ref('');
const depositOpen = ref(false);
const scanOpen = ref(false);

const CARD_CLASS = 'rounded-2xl border border-white/[0.07] bg-slate-900/60 shadow-lg backdrop-blur-md';
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
const QUICK_ACTION_CLASS = `group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/60 py-4 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.22,1.35,0.36,1)] active:scale-[0.91] hover:border-emerald-500/40 hover:bg-slate-800/80 hover:text-white ${FOCUS_RING}`;

const ripples = reactive({ send: 0, deposit: 0, scan: 0 });
const ripple = (id) => {
  ripples[id] += 1;
};

const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const signedPhpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', signDisplay: 'exceptZero' });
const dateFormatter = new Intl.DateTimeFormat('en-PH', { month: 'short', day: '2-digit', year: 'numeric' });

const formatPHP = (value) => phpFormatter.format(Number(value));
const formatSignedPHP = (value) => signedPhpFormatter.format(Number(value));

const fullName = computed(() => `${accountStore.user.first_name} ${accountStore.user.last_name}`);
const initials = computed(() => `${accountStore.user.first_name[0]}${accountStore.user.last_name[0]}`);

const recentTransactions = computed(() =>
  [...accountStore.transactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
);

const openSend = () => {
  transferPrefill.value = '';
  transferOpen.value = true;
};

const onScanned = (recipient) => {
  scanOpen.value = false;
  transferPrefill.value = recipient.accountNumber;
  transferOpen.value = true;
};
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-400">Welcome back</p>
        <h1 class="text-lg font-semibold text-white">Hey, {{ accountStore.user.first_name }}</h1>
      </div>
      <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-[11px] font-semibold text-emerald-500 ring-1 ring-emerald-500/30">
        {{ initials }}
      </span>
    </header>

    <!-- Compact Balance Card -->
    <section :class="`${CARD_CLASS} flex flex-col gap-4 p-5`">
      <div class="flex items-center justify-between">
        <p class="text-xs font-medium text-slate-400">Available balance</p>
        <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20 bg-emerald-500/10">
          <ShieldCheck aria-hidden="true" class="h-3 w-3" />
          {{ accountStore.account.status === 'active' ? 'Active' : accountStore.account.status }}
        </span>
      </div>

      <p class="text-3xl font-semibold tracking-tight tabular-nums text-white">
        {{ formatPHP(accountStore.account.balance) }}
      </p>

      <div class="flex items-end justify-between gap-3 border-t border-slate-700/60 pt-3">
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Account number</p>
          <p class="mt-0.5 text-xs tabular-nums text-white">{{ accountStore.account.account_number }}</p>
        </div>
        <div class="min-w-0 text-right">
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Holder</p>
          <p class="mt-0.5 truncate text-xs font-medium text-white">{{ fullName }}</p>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <div class="grid grid-cols-3 gap-3">
      <button
        type="button"
        @click="ripple('send'); openSend()"
        :class="`flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-xs font-semibold text-slate-900 relative overflow-hidden shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1.35,0.36,1)] active:scale-[0.91] hover:bg-emerald-400 ${FOCUS_RING}`"
      >
        <Send aria-hidden="true" class="h-5 w-5" />
        Send Money
        <span v-if="ripples.send" :key="ripples.send" @animationend="ripples.send = 0" class="liquid-ripple pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 rounded-full bg-emerald-400/40 blur-md"></span>
      </button>

      <button type="button" @click="ripple('deposit'); depositOpen = true" :class="QUICK_ACTION_CLASS">
        <ArrowDownToLine aria-hidden="true" class="h-5 w-5 text-emerald-500 transition-colors group-hover:text-emerald-400" />
        Deposit
        <span v-if="ripples.deposit" :key="ripples.deposit" @animationend="ripples.deposit = 0" class="liquid-ripple pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 rounded-full bg-emerald-400/40 blur-md"></span>
      </button>

      <button type="button" @click="ripple('scan'); scanOpen = true" :class="QUICK_ACTION_CLASS">
        <QrCode aria-hidden="true" class="h-5 w-5 text-emerald-500 transition-colors group-hover:text-emerald-400" />
        Scan QR
        <span v-if="ripples.scan" :key="ripples.scan" @animationend="ripples.scan = 0" class="liquid-ripple pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 rounded-full bg-emerald-400/40 blur-md"></span>
      </button>
    </div>

    <!-- Compact Transaction History -->
    <section :class="`${CARD_CLASS} p-4`">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-medium text-slate-300">Recent Activity</h2>
        <span class="text-[10px] uppercase tracking-wider text-slate-500">Last {{ recentTransactions.length }}</span>
      </div>

      <p v-if="recentTransactions.length === 0" class="py-6 text-center text-xs text-slate-400">No transactions yet.</p>

      <ul v-else class="divide-y divide-slate-700/50">
        <li v-for="tx in recentTransactions" :key="tx.id" class="flex items-center justify-between gap-3 py-3">
          <div class="flex min-w-0 items-center gap-3">
            <span :class="`grid h-8 w-8 shrink-0 place-items-center rounded-full ${Number(tx.amount) > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'}`">
              <ArrowDownLeft v-if="Number(tx.amount) > 0" aria-hidden="true" class="h-4 w-4" />
              <ArrowUpRight v-else aria-hidden="true" class="h-4 w-4" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-white">{{ tx.description }}</p>
              <p class="text-[11px] text-slate-400">{{ dateFormatter.format(new Date(tx.created_at)) }}</p>
            </div>
          </div>
          <p :class="`shrink-0 text-sm font-semibold tabular-nums ${Number(tx.amount) > 0 ? 'text-emerald-500' : 'text-slate-100'}`">
            {{ formatSignedPHP(tx.amount) }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Teleported so the sliding track's transform doesn't trap fixed-position overlays -->
    <Teleport to="#mobile-modal-root">
      <TransferModal
        :is-open="transferOpen"
        :current-balance="accountStore.account.balance"
        :initial-destination="transferPrefill"
        @close="transferOpen = false"
      />

      <DepositModal :is-open="depositOpen" @close="depositOpen = false" />

      <QrScannerModal :is-open="scanOpen" @close="scanOpen = false" @scanned="onScanned" />
    </Teleport>
  </div>
</template>

<style scoped>
/* Soft emerald pulse that expands from the center of a tapped quick-action button */
.liquid-ripple {
  animation: liquid-ripple 600ms ease-out;
}
@keyframes liquid-ripple {
  from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}
</style>
