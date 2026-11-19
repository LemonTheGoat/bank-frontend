<script setup>
import { ref } from 'vue';
import { ShieldCheck, Mail, Phone, Eye, User, ArrowRight } from 'lucide-vue-next';

// Vue ref replaces React useState
const showPassword = ref(false);

const handleNavigateToLogin = () => {
  // Navigates back to the root login page (index.vue)
  navigateTo('/');
};

const INPUT_CLASS = 'w-full rounded-xl border border-slate-200 bg-white/80 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-slate-950/80';
const ICON_CLASS = 'h-4 w-4 text-slate-400 dark:text-white/40';
</script>

<template>
  <div class="relative min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-500/30 flex items-center justify-center p-4 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">

    <!-- ================= DYNAMIC GLOWING BACKGROUND ================= -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-600/20"></div>
      <div class="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-400/15 blur-[150px] dark:bg-indigo-600/20"></div>
      <div class="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-300/15 blur-[120px] dark:bg-cyan-900/20"></div>
    </div>

    <!-- Theme toggle -->
    <div class="absolute right-4 top-4 z-20">
      <ThemeToggle />
    </div>

    <div class="relative z-10 w-full max-w-2xl">

      <!-- TOP BRANDING -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <ShieldCheck class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span class="text-lg font-bold tracking-tight text-slate-900 drop-shadow-md dark:text-white">SecureBank</span>
        </div>
      </div>

      <!-- MAIN REGISTER CARD -->
      <div class="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/70 px-6 py-12 shadow-lg backdrop-blur-2xl sm:px-12 dark:border-white/10 dark:bg-slate-900/40 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">

        <div class="text-center mb-10">
          <h1 class="bg-gradient-to-br from-emerald-400 to-emerald-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-4xl dark:from-emerald-300 dark:to-emerald-600">
            Create an Account
          </h1>
          <p class="mt-3 text-sm text-slate-600 dark:text-white/60">
            Join SecureBank today and take control of your finances.
          </p>
        </div>

        <!-- Vue uses @submit.prevent to replace onSubmit={(e) => e.preventDefault()} -->
        <form class="space-y-5" @submit.prevent>

          <!-- Full Name & Phone Row -->
          <div class="flex flex-col gap-5 sm:flex-row">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User :class="ICON_CLASS" />
              </div>
              <input type="text" placeholder="Full Name" :class="`${INPUT_CLASS} pl-11 pr-4`" />
            </div>
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone :class="ICON_CLASS" />
              </div>
              <input type="tel" placeholder="Phone Number" :class="`${INPUT_CLASS} pl-11 pr-4`" />
            </div>
          </div>

          <!-- Email Field -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Mail :class="ICON_CLASS" />
            </div>
            <input type="email" placeholder="Email Address" :class="`${INPUT_CLASS} pl-11 pr-4`" />
          </div>

          <!-- Password Field -->
          <div class="relative">
            <!-- The colon (:) binds the type attribute to the dynamic showPassword variable -->
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create Password"
              :class="`${INPUT_CLASS} pl-5 pr-11`"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70"
            >
              <Eye class="h-4 w-4" />
            </button>
          </div>

          <!-- Password Hint -->
          <p class="text-xs text-slate-500 px-2 dark:text-white/40">
            Must be at least 8 characters, with one uppercase letter and one number.
          </p>

          <!-- Action Buttons -->
          <div class="pt-4 space-y-4">
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
            >
              Create Account <ArrowRight class="h-4 w-4" />
            </button>

            <div class="text-center mt-6">
              <span class="text-sm text-slate-500 dark:text-white/50">Already have an account? </span>
              <button
                type="button"
                @click="handleNavigateToLogin"
                class="text-sm font-medium text-emerald-700 hover:text-emerald-600 underline decoration-emerald-500/30 underline-offset-4 transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Log in here
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
