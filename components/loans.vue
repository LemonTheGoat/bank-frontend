<script setup>
import { Calculator, FileText, ArrowRight } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

// Bring in your global state (replacing Redux)
const accountStore = useAccountStore();
</script>

<template>
  <div class="flex w-full flex-col gap-6 animate-in fade-in duration-300">
    <header>
      <h1 class="text-lg font-semibold text-white">Loan Center</h1>
      <p class="mt-0.5 text-xs text-slate-400">Manage active loans or apply for new credit</p>
    </header>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-[2rem] border border-slate-700/60 bg-slate-800 p-8 shadow-lg">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">Personal Loan</h2>
            <!-- You can eventually replace this with {{ accountStore.loan.account_id }} -->
            <p class="text-xs text-slate-400">Acct: LN-8828-1092-44</p>
          </div>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            Active
          </span>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-8 border-b border-slate-700/50 pb-8">
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Remaining</p>
            <p class="text-lg font-semibold text-emerald-500">₱32,450.00</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Original</p>
            <p class="text-lg font-medium text-white">₱50,000.00</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Rate</p>
            <p class="text-lg font-medium text-white">5.50%</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Next Due</p>
            <p class="text-lg font-medium text-white">Oct 28</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200">
            <Calculator class="h-4 w-4" /> Make Payment
          </button>
          <button class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">
            <FileText class="h-4 w-4" /> Statements
          </button>
        </div>
      </div>

      <div class="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-lg flex flex-col">
        <h3 class="text-lg font-bold text-white mb-2">Need more funds?</h3>
        <p class="text-xs text-slate-400 mb-8 leading-relaxed">
          Apply for a new auto, home, or personal loan with competitive rates and instant pre-approval.
        </p>
        <button class="mt-auto w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400">
          Calculate & Apply <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>