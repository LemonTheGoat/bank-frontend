<script setup>
import { ref } from 'vue';
import { Menu, X, ShieldCheck, Eye, Loader2 } from 'lucide-vue-next';
import { useAccountStore } from '~/stores/accountStore';

const isLoading = ref(false);
const accountStore = useAccountStore();

// Vue refs replace React useState
const email = ref('liam@bank.local');
const password = ref('');
const isMobileMenuOpen = ref(false);

const handleSubmit = () => {
  if (password.value) {
    // 1. Trigger the loading UI
    isLoading.value = true;

    // 2. Set your Pinia store data
    accountStore.login();

    // 3. Add the artificial 1.5-second buffer before routing
    setTimeout(() => {
      navigateTo('/dashboard');
    }, 1500);
  }
};

const handleNavigateToRegister = () => {
  navigateTo('/register');
};
</script>

<template>
  <div class="relative min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-500/30 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">

    <!-- ================= DYNAMIC GLOWING BACKGROUND ================= -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <!-- Top Left Emerald Glow -->
      <div class="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-600/20"></div>

      <!-- Bottom Right Deep Blue Glow -->
      <div class="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-400/15 blur-[150px] dark:bg-indigo-600/20"></div>

      <!-- Center Ambient Cyan Glow -->
      <div class="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-300/15 blur-[120px] dark:bg-cyan-900/20"></div>
    </div>
    <!-- ============================================================= -->

    <div class="relative z-10 flex min-h-screen flex-col">

      <!-- FLOATING NAVBAR (LIQUID GLASS) -->
      <div class="px-4 pt-6 sm:px-8">
        <nav class="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-slate-200 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span class="text-lg font-bold tracking-tight text-slate-900 drop-shadow-md dark:text-white">SecureBank</span>
          </div>

          <div class="hidden items-center gap-8 md:flex">
            <a href="#" class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white">Home</a>
            <a href="#" class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white">Careers</a>
            <a href="#" class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white">About</a>
            <a href="#" class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white">Security</a>
          </div>

          <div class="flex items-center gap-4">
            <ThemeToggle />
            <div class="hidden items-center gap-6 md:flex">
              <button @click="handleNavigateToRegister" class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white">Sign Up</button>
              <button class="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900">
                Login
              </button>
            </div>

            <button
              class="text-slate-600 hover:text-slate-900 focus:outline-none dark:text-white/70 dark:hover:text-white md:hidden"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <X v-if="isMobileMenuOpen" class="h-6 w-6" />
              <Menu v-else class="h-6 w-6" />
            </button>
          </div>
        </nav>
      </div>

      <!-- HERO & LOGIN SECTION -->
      <main class="mx-auto flex-1 max-w-5xl px-4 py-16 sm:py-24 w-full">

        <!-- THE MAIN LIQUID GLASS CARD -->
        <div class="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/70 px-6 py-16 shadow-lg backdrop-blur-2xl sm:px-12 sm:py-20 dark:border-white/10 dark:bg-slate-900/40 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">

          <!-- Subtle Dot Pattern overlay (top right) -->
          <div class="absolute right-0 top-0 -z-10 h-64 w-64 opacity-20" style="background-image: radial-gradient(rgba(16, 185, 129, 0.4) 1.5px, transparent 1.5px); background-size: 16px 16px; mask-image: radial-gradient(circle, black, transparent);"></div>

          <div class="mx-auto max-w-lg text-center">
            <h1 class="bg-gradient-to-br from-emerald-400 to-emerald-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-5xl pb-2 leading-normal dark:from-emerald-300 dark:to-emerald-600">
              Login
            </h1>
            <p class="mt-4 text-sm text-slate-600 dark:text-white/70">
              Welcome back! Please log in to access your account.
            </p>
          </div>

          <div class="mx-auto mt-12 max-w-2xl">
            <form @submit.prevent="handleSubmit" class="flex flex-col items-center space-y-6">

              <!-- Inputs (Side by side on desktop) -->
              <div class="flex w-full flex-col gap-4 sm:flex-row">
                <div class="flex-1">
                  <input
                    type="email"
                    required
                    v-model="email"
                    placeholder="Enter your Email"
                    class="w-full rounded-xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-slate-950/80"
                  />
                </div>
                <div class="relative flex-1">
                  <input
                    type="password"
                    required
                    v-model="password"
                    placeholder="Enter your Password"
                    class="w-full rounded-xl border border-slate-200 bg-white/80 py-3.5 pl-5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-white/40 dark:focus:bg-slate-950/80"
                  />
                  <Eye class="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                </div>
              </div>

              <a href="#" class="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900 hover:decoration-emerald-500 dark:text-white/60 dark:decoration-white/20 dark:hover:text-white dark:hover:decoration-emerald-400">
                Forgot Password?
              </a>

              <div class="w-full max-w-sm space-y-4">
                <button
                  type="submit"
                  class="w-full flex h-[50px] items-center justify-center rounded-full bg-emerald-500 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
                >
                  Login
                </button>
                <button
                  type="button"
                  @click="handleNavigateToRegister"
                  class="w-full rounded-full border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-900 backdrop-blur-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus:ring-white/20 dark:focus:ring-offset-slate-950"
                >
                  Sign Up
                </button>
              </div>

              <!-- Social Login -->
              <div class="w-full max-w-sm pt-4">
                <div class="relative flex items-center justify-center">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200 dark:border-white/10"></div>
                  </div>
                  <span class="relative rounded-full bg-white/80 px-4 text-xs font-medium text-slate-500 backdrop-blur-xl dark:bg-slate-900/80 dark:text-white/50">Or Continue with</span>
                </div>

                <div class="mt-6 flex justify-center gap-4">
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span class="text-lg font-bold">G</span>
                  </button>
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span class="text-lg font-bold">f</span>
                  </button>
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span class="text-sm font-bold">in</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>

    <!-- Full-Screen Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm transition-all dark:bg-slate-950/80">
      <Loader2 class="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-500" />
      <p class="mt-4 font-mono text-sm font-medium tracking-widest text-emerald-600 animate-pulse dark:text-emerald-500">
        AUTHENTICATING...
      </p>
    </div>

  </div>
</template>
