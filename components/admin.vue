<script setup>
import { Users, Activity, Database, AlertTriangle } from 'lucide-vue-next';

// Data arrays moved cleanly into the script block
const auditLogs = [
  { id: 1, action: 'AUTH_LOGIN', user: 'liam@bank.local', ip: '192.168.1.45', status: 'Success' },
  { id: 2, action: 'TRANSFER_OUT', user: 'liam@bank.local', ip: '192.168.1.45', status: 'Success' },
  { id: 3, action: 'AUTH_LOGIN', user: 'unknown', ip: '45.22.19.11', status: 'Failed' },
];

const stats = [
  { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-400' },
  { label: 'Sessions', value: '342', icon: Activity, color: 'text-emerald-400' },
  { label: 'Pending', value: '0', icon: Database, color: 'text-white' },
  { label: 'Alerts', value: '3', icon: AlertTriangle, color: 'text-rose-400' },
];
</script>

<template>
  <div class="flex w-full flex-col gap-6 animate-in fade-in duration-300">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-lg font-semibold text-rose-400">Admin Console</h1>
        <p class="mt-0.5 text-xs text-slate-400">System oversight and reconciliation</p>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-4 mb-2">
      <!-- Vue v-for seamlessly loops over the stats array -->
      <div v-for="(stat, i) in stats" :key="i" class="rounded-2xl border border-slate-700/60 bg-slate-800 p-5 shadow-lg flex items-center gap-4">
        <!-- Dynamic component binding for Lucide icons -->
        <component :is="stat.icon" :class="`h-6 w-6 ${stat.color}`" />
        <div>
          <p class="text-[10px] uppercase tracking-wider text-slate-400">{{ stat.label }}</p>
          <p class="text-lg font-bold text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="rounded-[2rem] border border-slate-700/60 bg-slate-800 p-6 shadow-lg">
      <h2 class="text-sm font-medium text-slate-300 mb-4">Live Audit Log</h2>
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-700/50 text-slate-400">
            <th class="pb-3 font-medium">Action</th>
            <th class="pb-3 font-medium">User</th>
            <th class="pb-3 font-medium">IP Address</th>
            <th class="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody class="text-slate-300">
          <tr v-for="log in auditLogs" :key="log.id" class="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20">
            <td class="py-3 font-mono text-slate-400">{{ log.action }}</td>
            <td class="py-3">{{ log.user }}</td>
            <td class="py-3 font-mono">{{ log.ip }}</td>
            <td class="py-3">
              <!-- Dynamic class binding for status colors -->
              <span :class="`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-400'}`">
                {{ log.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>