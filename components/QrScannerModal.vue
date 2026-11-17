<script setup>
import { computed, ref } from 'vue';
import { X, ScanLine } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'scanned']);
const accountStore = useAccountStore();

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
const TABS = [
  { id: 'scan', label: 'Scan' },
  { id: 'my-qr', label: 'My QR' },
];

const SAMPLE_RECIPIENT = { name: 'Maria Santos', accountNumber: 'PH-4417-0356-18' };

const tab = ref('scan');

const fullName = computed(() => `${accountStore.user.first_name} ${accountStore.user.last_name}`);
const myAccountNumber = computed(() => accountStore.account.account_number);

// Deterministic 21x21 placeholder QR pattern with three finder squares
const QR_SIZE = 21;
const finderCell = (r, c) => {
  const origins = [[0, 0], [0, QR_SIZE - 7], [QR_SIZE - 7, 0]];
  for (const [r0, c0] of origins) {
    const lr = r - r0;
    const lc = c - c0;
    if (lr >= 0 && lr < 7 && lc >= 0 && lc < 7) {
      return lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
    }
  }
  return null;
};
const qrCells = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const r = Math.floor(i / QR_SIZE);
  const c = i % QR_SIZE;
  const finder = finderCell(r, c);
  if (finder !== null) return finder;
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 > 0.5;
});

const simulateScan = () => {
  emit('scanned', SAMPLE_RECIPIENT);
};

const close = () => {
  tab.value = 'scan';
  emit('close');
};
</script>

<template>
  <Transition appear name="liquid-backdrop">
    <div
      v-if="isOpen"
      class="liquid-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80"
      @click.self="close"
    >
      <Transition appear name="liquid-modal">
        <div v-if="isOpen" class="mx-auto flex w-full max-w-md justify-center px-4">
    <div class="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

      <div class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h2 class="text-lg font-semibold text-white">QR Pay</h2>
        <button type="button" @click="close" class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div role="tablist" aria-label="QR views" class="flex gap-5 border-b border-slate-800 px-6">
        <button
          v-for="t in TABS"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="tab === t.id"
          @click="tab = t.id"
          :class="`relative rounded-sm pb-2.5 pt-3 text-sm font-medium transition-colors ${FOCUS_RING} ${tab === t.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`"
        >
          {{ t.label }}
          <span v-if="tab === t.id" aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-500"></span>
        </button>
      </div>

      <!-- SCAN TAB -->
      <div v-if="tab === 'scan'" class="flex flex-col items-center gap-6 p-6">
        <div class="relative aspect-square w-56 overflow-hidden rounded-2xl bg-slate-950/80">
          <span class="absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-emerald-500"></span>
          <span class="absolute right-3 top-3 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-emerald-500"></span>
          <span class="absolute bottom-3 left-3 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-emerald-500"></span>
          <span class="absolute bottom-3 right-3 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-emerald-500"></span>
          <span aria-hidden="true" class="scan-line absolute inset-x-6 h-0.5 rounded-full bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
          <div class="absolute inset-0 grid place-items-center">
            <ScanLine aria-hidden="true" class="h-8 w-8 text-slate-700" />
          </div>
        </div>

        <p class="text-center text-xs text-slate-400">Align a merchant or peer QR code within the frame.</p>

        <button
          type="button"
          @click="simulateScan"
          :class="`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-emerald-400 ${FOCUS_RING}`"
        >
          <ScanLine aria-hidden="true" class="h-4 w-4" />
          Simulate Scan Merchant / Peer QR
        </button>
        <p class="text-[11px] text-slate-500">Demo: {{ SAMPLE_RECIPIENT.name }} ({{ SAMPLE_RECIPIENT.accountNumber }})</p>
      </div>

      <!-- MY QR TAB -->
      <div v-else class="flex flex-col items-center gap-5 p-6">
        <div class="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div class="mx-auto w-48 rounded-xl bg-white p-3">
            <div
              class="grid aspect-square w-full gap-px"
              :style="{ gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0, 1fr))` }"
            >
              <span
                v-for="(on, i) in qrCells"
                :key="i"
                :class="on ? 'bg-slate-900' : 'bg-white'"
              ></span>
            </div>
          </div>
          <div class="mt-5 text-center">
            <p class="text-sm font-medium text-white">{{ fullName }}</p>
            <p class="mt-0.5 font-mono text-xs text-slate-400">{{ myAccountNumber }}</p>
          </div>
        </div>
        <p class="text-center text-xs text-slate-400">Show this code to receive money from another SecureBank user.</p>
      </div>

    </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes scanLine {
  0% { top: 12%; }
  50% { top: 84%; }
  100% { top: 12%; }
}
.scan-line {
  animation: scanLine 2.4s ease-in-out infinite;
}
</style>
