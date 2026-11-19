<script setup>
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-vue-next';

// You can eventually replace this with the transactions from accountStore
const dummyTransactions = [
  { id: 1, type: 'credit', title: 'Salary Deposit', date: 'Oct 15, 2026', amount: '+ ₱45,000.00' },
  { id: 2, type: 'debit', title: 'Gym', date: 'Oct 14, 2026', amount: '- ₱2,500.00' },
  { id: 3, type: 'debit', title: 'Spotify Premium', date: 'Oct 12, 2026', amount: '- ₱149.00' },
  { id: 4, type: 'credit', title: 'Transfer from Xian', date: 'Oct 10, 2026', amount: '+ ₱1,000.00' },
  { id: 5, type: 'debit', title: 'Steam Games', date: 'Oct 08, 2026', amount: '- ₱850.00' },
];
</script>

<template>
  <div class="flex w-full flex-col gap-6 animate-in fade-in duration-300">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Transaction History</h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">View and search your full ledger</p>
      </div>
      <button class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:shadow-none dark:hover:bg-slate-700">
        <Filter class="h-3.5 w-3.5" /> Filter
      </button>
    </header>

    <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-lg">
      <div class="space-y-3">

        <!-- Vue uses v-for instead of React's .map() -->
        <div
          v-for="txn in dummyTransactions"
          :key="txn.id"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/30"
        >
          <div class="flex items-center gap-4">

            <!-- Use :class for dynamic styling in Vue -->
            <div :class="`flex h-10 w-10 items-center justify-center rounded-full ${txn.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`">

              <!-- Use v-if and v-else instead of ternary operators for elements -->
              <ArrowDownLeft v-if="txn.type === 'credit'" class="h-4 w-4" />
              <ArrowUpRight v-else class="h-4 w-4" />
            </div>

            <div>
              <!-- Variables use {{ }} mustache syntax -->
              <p class="text-sm font-medium text-slate-900 dark:text-white">{{ txn.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ txn.date }}</p>
            </div>
          </div>

          <div class="text-right">
            <p :class="`font-mono text-sm font-semibold ${txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`">
              {{ txn.amount }}
            </p>
            <p class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Completed</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
