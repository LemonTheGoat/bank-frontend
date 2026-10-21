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
  <div class="relative min-h-screen bg-[#020617] font-sans text-slate-100 antialiased selection:bg-emerald-500/30">
    
    <!-- ================= DYNAMIC GLOWING BACKGROUND ================= -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <!-- Top Left Emerald Glow -->
      <div class="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-600/20 blur-[120px]"></div>
      
      <!-- Bottom Right Deep Blue Glow -->
      <div class="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/20 blur-[150px]"></div>
      
      <!-- Center Ambient Cyan Glow -->
      <div class="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-900/20 blur-[120px]"></div>
    </div>
    <!-- ============================================================= -->

    <div class="relative z-10 flex min-h-screen flex-col">
      
      <!-- FLOATING NAVBAR (LIQUID GLASS) -->
      <div class="px-4 pt-6 sm:px-8">
        <nav class="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div class="flex items-center gap-2">
            <ShieldCheck class="h-6 w-6 text-emerald-400" />
            <span class="text-lg font-bold tracking-tight text-white drop-shadow-md">SecureBank</span>
          </div>

          <div class="hidden items-center gap-8 md:flex">
            <a href="#" class="text-sm font-medium text-white/70 transition-colors hover:text-white">Home</a>
            <a href="#" class="text-sm font-medium text-white/70 transition-colors hover:text-white">Careers</a>
            <a href="#" class="text-sm font-medium text-white/70 transition-colors hover:text-white">About</a>
            <a href="#" class="text-sm font-medium text-white/70 transition-colors hover:text-white">Security</a>
          </div>

          <div class="hidden items-center gap-6 md:flex">
            <button @click="handleNavigateToRegister" class="text-sm font-medium text-white/70 transition-colors hover:text-white">Sign Up</button>
            <button class="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              Login
            </button>
          </div>

          <button 
            class="text-white/70 hover:text-white focus:outline-none md:hidden"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <X v-if="isMobileMenuOpen" class="h-6 w-6" />
            <Menu v-else class="h-6 w-6" />
          </button>
        </nav>
      </div>

      <!-- HERO & LOGIN SECTION -->
      <main class="mx-auto flex-1 max-w-5xl px-4 py-16 sm:py-24 w-full">
        
        <!-- THE MAIN LIQUID GLASS CARD -->
        <div class="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 px-6 py-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:px-12 sm:py-20">
          
          <!-- Subtle Dot Pattern overlay (top right) -->
          <div class="absolute right-0 top-0 -z-10 h-64 w-64 opacity-20" style="background-image: radial-gradient(rgba(16, 185, 129, 0.4) 1.5px, transparent 1.5px); background-size: 16px 16px; mask-image: radial-gradient(circle, black, transparent);"></div>

          <div class="mx-auto max-w-lg text-center">
           <h1 class="bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-5xl pb-2 leading-normal">
              Login
            </h1>
            <p class="mt-4 text-sm text-white/70">
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
                    class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-5 py-3.5 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
                <div class="relative flex-1">
                  <input
                    type="password"
                    required
                    v-model="password"
                    placeholder="Enter your Password"
                    class="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-5 pr-10 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <Eye class="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                </div>
              </div>

              <a href="#" class="text-sm font-medium text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-emerald-400">
                Forgot Password?
              </a>

              <div class="w-full max-w-sm space-y-4">
                <button
                  type="submit"
                  class="w-full flex h-[50px] items-center justify-center rounded-full bg-emerald-500 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
                >
                  Login
                </button>
                <button
                  type="button"
                  @click="handleNavigateToRegister"
                  class="w-full rounded-full border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#020617]"
                >
                  Sign Up
                </button>
              </div>

              <!-- Social Login -->
              <div class="w-full max-w-sm pt-4">
                <div class="relative flex items-center justify-center">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-white/10"></div>
                  </div>
                  <span class="relative bg-slate-900/80 px-4 text-xs font-medium text-white/50 backdrop-blur-xl rounded-full">Or Continue with</span>
                </div>

                <div class="mt-6 flex justify-center gap-4">
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span class="text-lg font-bold">G</span>
                  </button>
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span class="text-lg font-bold">f</span>
                  </button>
                  <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
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
    <div v-if="isLoading" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all">
      <Loader2 class="h-10 w-10 animate-spin text-emerald-500" />
      <p class="mt-4 font-mono text-sm font-medium tracking-widest text-emerald-500 animate-pulse">
        AUTHENTICATING...
      </p>
    </div>

  </div>
</template>