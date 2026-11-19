<script setup>
import { ref, watch } from 'vue';
import { X, AlertCircle, Check } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

const props = defineProps({
  isOpen: Boolean,
  currentBalance: [Number, String],
  initialDestination: { type: String, default: '' }
});

const emit = defineEmits(['close']);
const accountStore = useAccountStore();

const phpFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

const INPUT_CLASS = 'w-full rounded-lg border border-slate-200 bg-slate-100/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500';
const LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300';

const destination = ref('');
const amount = ref('');
const description = ref('');
const error = ref('');
const isConfirmed = ref(false);
const receipt = ref(null);

const createReference = () => `REF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

watch(() => props.isOpen, (open) => {
  if (!open) return;
  destination.value = props.initialDestination;
  error.value = '';
  isConfirmed.value = false;
  receipt.value = null;
});

const handleSubmit = () => {
  error.value = '';
  const numAmount = parseFloat(amount.value);

  if (!destination.value.trim()) {
    error.value = 'Please enter a destination account number.';
    return;
  }
  if (isNaN(numAmount) || numAmount <= 0) {
    error.value = 'Transfer amount must be greater than 0.';
    return;
  }
  if (numAmount > Number(props.currentBalance)) {
    error.value = 'Insufficient funds for this transfer.';
    return;
  }

  receipt.value = {
    amount: numAmount,
    destination: destination.value.trim(),
    ref: createReference()
  };

  accountStore.transferFunds({
    amount: numAmount,
    destination: destination.value,
    description: description.value.trim() || 'Fund Transfer'
  });

  destination.value = '';
  amount.value = '';
  description.value = '';
  isConfirmed.value = true;
};
</script>

<template>
  <Transition appear name="liquid-backdrop">
    <div v-if="isOpen" class="liquid-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/80">
      <ConfettiBurst v-if="isConfirmed" />
      <Transition appear name="liquid-modal">
        <div v-if="isOpen" class="mx-auto flex w-full max-w-md justify-center px-4">
          <div class="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur-md transition-colors duration-300 dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-2xl">
            <Transition mode="out-in" name="fade-scale">
              <div v-if="!isConfirmed" key="form">
                <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700/60">
                  <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Transfer Funds</h2>
                  <button type="button" @click="$emit('close')" class="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                    <X class="h-5 w-5" />
                  </button>
                </div>

                <form @submit.prevent="handleSubmit" class="p-6">
                  <div v-if="error" class="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                    <AlertCircle class="h-4 w-4 shrink-0" />
                    <p>{{ error }}</p>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label for="destination" :class="LABEL_CLASS">Destination Account</label>
                      <input id="destination" type="text" v-model="destination" placeholder="e.g. PH-1234-5678-90" :class="INPUT_CLASS" />
                    </div>

                    <div>
                      <label for="amount" class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span>Amount</span>
                        <span class="text-slate-400 dark:text-slate-500">Available: ₱{{ Number(currentBalance).toLocaleString() }}</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">₱</span>
                        <input id="amount" type="number" step="0.01" v-model="amount" placeholder="0.00" :class="`${INPUT_CLASS} py-2 pl-8 pr-3 font-mono`" />
                      </div>
                    </div>

                    <div>
                      <label for="description" :class="LABEL_CLASS">Description <span class="text-slate-400 dark:text-slate-500">(Optional)</span></label>
                      <input id="description" type="text" v-model="description" placeholder="What is this for?" :class="INPUT_CLASS" />
                    </div>
                  </div>

                  <div class="mt-8 flex items-center justify-end gap-3">
                    <button type="button" @click="$emit('close')" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-300 dark:hover:text-white">Cancel</button>
                    <button type="submit" class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">Confirm Transfer</button>
                  </div>
                </form>
              </div>

              <div v-else key="receipt" class="flex flex-col items-center px-6 py-8 text-center">
                <div class="receipt-badge grid h-16 w-16 place-items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.4)]">
                  <Check aria-hidden="true" class="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h2 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white">Transfer Confirmed</h2>
                <p class="mt-3 text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ phpFormatter.format(receipt.amount) }}</p>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Ref <span class="font-mono text-slate-700 dark:text-slate-300">{{ receipt.ref }}</span></p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">To {{ receipt.destination }}</p>

                <button type="button" @click="$emit('close')" class="mt-8 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">Done</button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
