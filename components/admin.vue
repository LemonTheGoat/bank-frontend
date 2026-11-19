<script setup>
import { computed } from 'vue';
import { Check, ClipboardCheck, Lock, Unlock, X } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

const accountStore = useAccountStore();

const customers = computed(() => accountStore.customers);
const pendingApprovals = computed(() => accountStore.pendingApprovals);

const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const formatPHP = (value) => phpFormatter.format(Number(value));

// Data arrays moved cleanly into the script block
const auditLogs = [
  { id: 1, action: 'AUTH_LOGIN', user: 'liam@bank.local', ip: '192.168.1.45', status: 'Success' },
  { id: 2, action: 'TRANSFER_OUT', user: 'liam@bank.local', ip: '192.168.1.45', status: 'Success' },
  { id: 3, action: 'AUTH_LOGIN', user: 'unknown', ip: '45.22.19.11', status: 'Failed' },
];

const CARD_CLASS = 'rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-lg';
const SECTION_TITLE = 'mb-4 text-sm font-medium text-slate-700 dark:text-slate-300';
const TABLE_HEAD = 'border-b border-slate-200 text-slate-500 dark:border-slate-700/50 dark:text-slate-400';
const ROW_CLASS = 'border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700/30 dark:hover:bg-slate-700/20';

const CUSTOMER_STATUS_STYLES = {
  Active: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-500',
  Frozen: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 hover:bg-rose-500/20 dark:text-rose-400',
};
</script>

<template>
  <div class="flex w-full flex-col gap-6 animate-in fade-in duration-300">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-lg font-semibold text-rose-600 dark:text-rose-400">Admin Console</h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">System oversight and reconciliation</p>
      </div>
    </header>

    <div :class="CARD_CLASS">
      <h2 :class="SECTION_TITLE">Customers</h2>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr :class="TABLE_HEAD">
              <th class="pb-3 font-medium">Name</th>
              <th class="pb-3 font-medium">Account Number</th>
              <th class="pb-3 font-medium text-right">Balance</th>
              <th class="pb-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody class="text-slate-700 dark:text-slate-300">
            <tr v-for="customer in customers" :key="customer.id" :class="ROW_CLASS">
              <td class="py-3 font-medium text-slate-900 dark:text-white">{{ customer.name }}</td>
              <td class="py-3 font-mono">{{ customer.accountNumber }}</td>
              <td class="py-3 text-right font-mono tabular-nums">{{ formatPHP(customer.balance) }}</td>
              <td class="py-3 text-right">
                <button
                  type="button"
                  @click="accountStore.toggleCustomerStatus(customer.id)"
                  :class="`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${CUSTOMER_STATUS_STYLES[customer.status]}`"
                >
                  <Unlock v-if="customer.status === 'Active'" class="h-3 w-3" />
                  <Lock v-else class="h-3 w-3" />
                  {{ customer.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div :class="CARD_CLASS">
      <h2 :class="SECTION_TITLE">Pending Approvals</h2>
      <p v-if="pendingApprovals.length === 0" class="flex items-center gap-2 py-6 text-xs text-slate-500 dark:text-slate-400">
        <ClipboardCheck class="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        No pending approvals.
      </p>
      <ul v-else class="divide-y divide-slate-200 dark:divide-slate-700/30">
        <li v-for="approval in pendingApprovals" :key="approval.id" class="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-900 dark:text-white">{{ approval.customerName }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ approval.type }} · <span class="font-mono text-slate-700 dark:text-slate-300">{{ formatPHP(approval.amount) }}</span>
            </p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              @click="accountStore.resolveApproval(approval.id, 'approve')"
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/20 transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-500"
            >
              <Check class="h-3.5 w-3.5" /> Approve
            </button>
            <button
              type="button"
              @click="accountStore.resolveApproval(approval.id, 'reject')"
              class="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-inset ring-rose-500/20 transition-colors hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-400"
            >
              <X class="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div :class="CARD_CLASS">
      <h2 :class="SECTION_TITLE">Live Audit Log</h2>
      <table class="w-full text-left text-xs">
        <thead>
          <tr :class="TABLE_HEAD">
            <th class="pb-3 font-medium">Action</th>
            <th class="pb-3 font-medium">User</th>
            <th class="pb-3 font-medium">IP Address</th>
            <th class="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody class="text-slate-700 dark:text-slate-300">
          <tr v-for="log in auditLogs" :key="log.id" :class="ROW_CLASS">
            <td class="py-3 font-mono text-slate-500 dark:text-slate-400">{{ log.action }}</td>
            <td class="py-3">{{ log.user }}</td>
            <td class="py-3 font-mono">{{ log.ip }}</td>
            <td class="py-3">
              <span :class="`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`">
                {{ log.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
