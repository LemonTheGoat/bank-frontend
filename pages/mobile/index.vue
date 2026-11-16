<script setup>
import { computed, ref } from 'vue';
import { ArrowDownLeft, ArrowUpRight, Send, ShieldCheck } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

definePageMeta({ layout: 'mobile' });

const accountStore = useAccountStore();

const transferOpen = ref(false);

const CARD_CLASS = 'rounded-2xl border border-slate-700/60 bg-slate-800 shadow-lg';
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

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
</script>

<template>
  <div class="flex w-full flex-col gap-5 animate-in fade-in duration-300">
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

      <p class="font-mono text-3xl font-semibold tracking-tight text-white">
        {{ formatPHP(accountStore.account.balance) }}
      </p>

      <div class="flex items-end justify-between gap-3 border-t border-slate-700/60 pt-3">
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Account number</p>
          <p class="mt-0.5 font-mono text-xs text-white">{{ accountStore.account.account_number }}</p>
        </div>
        <div class="min-w-0 text-right">
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Holder</p>
          <p class="mt-0.5 truncate text-xs font-medium text-white">{{ fullName }}</p>
        </div>
      </div>
    </section>

    <button
      type="button"
      @click="transferOpen = true"
      :class="`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-emerald-400 ${FOCUS_RING}`"
    >
      <Send aria-hidden="true" class="h-4 w-4" />
      Send Money
    </button>

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
          <p :class="`shrink-0 font-mono text-sm font-semibold ${Number(tx.amount) > 0 ? 'text-emerald-500' : 'text-slate-100'}`">
            {{ formatSignedPHP(tx.amount) }}
          </p>
        </li>
      </ul>
    </section>

    <TransferModal
      :is-open="transferOpen"
      :current-balance="accountStore.account.balance"
      @close="transferOpen = false"
    />
  </div>
</template>
