<script setup>
import { CreditCard, Lock, EyeOff, Plus } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

// Bring in your global state
const accountStore = useAccountStore();

const CARD_CLASS = 'rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-lg';
</script>

<template>
  <div class="flex w-full flex-col gap-6 animate-in fade-in duration-300">
    <header>
      <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Card Management</h1>
      <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Manage your virtual and physical cards</p>
    </header>

    <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      <!-- VIRTUAL CARD DISPLAY -->
      <div :class="`${CARD_CLASS} p-8 xl:col-span-2 flex flex-col items-center justify-center`">
        <!-- The card face stays rich emerald in both themes, so its white text stays high-contrast -->
        <div class="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-white/20">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 opacity-90 z-0"></div>
          <div class="relative z-10 flex justify-between items-start w-full">
            <span class="text-xl font-bold tracking-widest text-white drop-shadow-md">SecureBank</span>
            <CreditCard class="h-8 w-8 text-white/80" />
          </div>
          <div class="relative z-10 w-full mt-auto">
            <div class="flex gap-4 mb-2">
              <span class="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
              <span class="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
              <span class="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
              <span class="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">8024</span>
            </div>
            <div class="flex justify-between items-end">
              <div class="flex flex-col">
                <span class="text-[10px] text-white/60 uppercase tracking-widest">Cardholder</span>
                <span class="text-sm font-medium text-white tracking-widest">{{ accountStore.user.first_name.toUpperCase() }} {{ accountStore.user.last_name.toUpperCase() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-white/60 uppercase tracking-widest">Expires</span>
                <span class="text-sm font-medium text-white tracking-widest">12/28</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-4 w-full max-w-md">
          <button class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-3 text-sm font-medium text-rose-600 hover:bg-rose-500/20 transition-colors dark:text-rose-400">
            <Lock class="h-4 w-4" /> Freeze Card
          </button>
          <button class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 py-3 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors dark:bg-white/5 dark:border-slate-600 dark:text-white dark:hover:bg-white/10">
            <EyeOff class="h-4 w-4" /> Show Details
          </button>
        </div>
      </div>

      <!-- CARD SETTINGS -->
      <div class="flex flex-col gap-6">
        <div :class="`${CARD_CLASS} p-6`">
          <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Spending Limits</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-slate-500 dark:text-slate-400">Online Purchases</span>
                <span class="text-emerald-700 dark:text-emerald-400 font-mono">₱15k / ₱50k</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-1.5">
                <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 30%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-slate-500 dark:text-slate-400">ATM Withdrawals</span>
                <span class="text-emerald-700 dark:text-emerald-400 font-mono">₱0 / ₱20k</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-1.5">
                <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <button class="flex items-center justify-center gap-2 w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white">
          <Plus class="h-5 w-5" />
          <span class="font-medium text-sm">Request Virtual Card</span>
        </button>
      </div>
    </div>
  </div>
</template>
