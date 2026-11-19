<script setup>
import { ref, watch } from 'vue';
import { X, AlertCircle, Check } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const accountStore = useAccountStore();

const PRESETS = [500, 1000, 5000];
const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const receiptFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

const amount = ref('');
const error = ref('');
const isConfirmed = ref(false);
const receipt = ref(null);

const createReference = () => `REF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

watch(() => props.isOpen, (open) => {
  if (!open) return;
  amount.value = '';
  error.value = '';
  isConfirmed.value = false;
  receipt.value = null;
});

const selectPreset = (value) => {
  amount.value = String(value);
  error.value = '';
};

const close = () => {
  amount.value = '';
  error.value = '';
  emit('close');
};

const handleSubmit = () => {
  error.value = '';
  const numAmount = parseFloat(amount.value);

  if (isNaN(numAmount) || numAmount <= 0) {
    error.value = 'Deposit amount must be greater than 0.';
    return;
  }

  receipt.value = { amount: numAmount, ref: createReference() };
  accountStore.depositFunds(numAmount.toFixed(2));
  amount.value = '';
  isConfirmed.value = true;
};
</script>

<template>
  <Transition appear name="liquid-backdrop">
    <div
      v-if="isOpen"
      class="liquid-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/80"
      @click.self="close"
    >
      <ConfettiBurst v-if="isConfirmed" />
      <Transition appear name="liquid-modal">
        <div v-if="isOpen" class="mx-auto flex w-full max-w-md justify-center px-4">
          <div class="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl">
            <Transition mode="out-in" name="fade-scale">
              <div v-if="!isConfirmed" key="form">
                <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                  <div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Deposit Funds</h2>
                    <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Method: Mobile Cash-In</p>
                  </div>
                  <button type="button" @click="close" class="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                    <X class="h-5 w-5" />
                  </button>
                </div>

                <form @submit.prevent="handleSubmit" class="p-6">
                  <div v-if="error" class="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                    <AlertCircle class="h-4 w-4 shrink-0" />
                    <p>{{ error }}</p>
                  </div>

                  <p class="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">Quick amounts</p>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="preset in PRESETS"
                      :key="preset"
                      type="button"
                      @click="selectPreset(preset)"
                      :class="`rounded-lg border px-2 py-2 font-mono text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${Number(amount) === preset ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500/40 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:text-white'}`"
                    >
                      {{ phpFormatter.format(preset) }}
                    </button>
                  </div>

                  <label for="deposit-amount" class="mb-1.5 mt-5 block text-xs font-medium text-slate-600 dark:text-slate-300">Custom amount</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">₱</span>
                    <input
                      id="deposit-amount"
                      type="number"
                      step="0.01"
                      v-model="amount"
                      placeholder="0.00"
                      class="w-full rounded-lg border border-slate-200 bg-slate-100/90 py-2 pl-8 pr-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div class="mt-8 flex items-center justify-end gap-3">
                    <button type="button" @click="close" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-300 dark:hover:text-white">Cancel</button>
                    <button type="submit" class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">Confirm Deposit</button>
                  </div>
                </form>
              </div>

              <div v-else key="receipt" class="flex flex-col items-center px-6 py-8 text-center">
                <div class="receipt-badge grid h-16 w-16 place-items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.4)]">
                  <Check aria-hidden="true" class="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h2 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white">Deposit Confirmed</h2>
                <p class="mt-3 text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ receiptFormatter.format(receipt.amount) }}</p>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Ref <span class="font-mono text-slate-700 dark:text-slate-300">{{ receipt.ref }}</span></p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Mobile Cash-In</p>

                <button type="button" @click="$emit('close')" class="mt-8 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">Done</button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
