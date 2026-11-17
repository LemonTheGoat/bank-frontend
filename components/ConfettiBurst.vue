<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const LIFETIME_MS = 1900;
const COLORS = ['bg-emerald-400', 'bg-emerald-300', 'bg-teal-300', 'bg-amber-300', 'bg-white'];
const SHAPES = [
  'h-4 w-2.5 rounded-sm',
  'h-3 w-3 rounded-full',
  'h-2.5 w-3 rounded-[2px]'
];

// Three depth planes: foreground pieces rush toward the camera, background pieces recede
const DEPTHS = {
  foreground: {
    peak: 1.5,
    distance: [160, 320],
    depth: [120, 200],
    extra: 'confetti-foreground'
  },
  midground: {
    peak: 1,
    distance: [110, 240],
    depth: [0, 60],
    extra: ''
  },
  background: {
    peak: 0.7,
    distance: [70, 180],
    depth: [-200, -120],
    extra: 'confetti-background'
  }
};

const DEPTH_PLAN = [
  ...Array(20).fill('foreground'),
  ...Array(36).fill('midground'),
  ...Array(24).fill('background')
];

const rand = (min, max) => min + Math.random() * (max - min);

const particles = ref([]);
let cleanupTimer = null;

const spawn = () => {
  particles.value = DEPTH_PLAN.map((depthName, i) => {
    const depth = DEPTHS[depthName];
    const angle = rand(0, Math.PI * 2);
    const distance = rand(...depth.distance);
    return {
      id: i,
      shape: SHAPES[i % SHAPES.length],
      color: COLORS[i % COLORS.length],
      extra: depth.extra,
      style: {
        '--dx': `${(Math.cos(angle) * distance).toFixed(1)}px`,
        '--dy': `${(Math.sin(angle) * distance).toFixed(1)}px`,
        '--dz': `${rand(...depth.depth).toFixed(1)}px`,
        '--peak': depth.peak,
        '--rx': `${Math.round(rand(-540, 540))}deg`,
        '--ry': `${Math.round(rand(-540, 540))}deg`,
        '--rz': `${Math.round(rand(-360, 360))}deg`,
        animationDelay: `${Math.round(rand(0, 100))}ms`
      }
    };
  });
};

onMounted(() => {
  spawn();
  cleanupTimer = setTimeout(() => {
    particles.value = [];
  }, LIFETIME_MS);
});

onBeforeUnmount(() => clearTimeout(cleanupTimer));
</script>

<template>
  <div v-if="particles.length" aria-hidden="true" class="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
    <!-- Origin at the center of the screen so the burst spreads past the modal card -->
    <div class="absolute left-1/2 top-1/2">
      <span
        v-for="particle in particles"
        :key="particle.id"
        :class="`confetti-particle absolute -left-1.5 -top-2 shadow-[0_0_6px_rgba(16,185,129,0.5)] ${particle.shape} ${particle.color} ${particle.extra}`"
        :style="particle.style"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.confetti-particle {
  animation: confetti-burst 1.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.confetti-foreground {
  filter: blur(0.6px);
}

.confetti-background {
  filter: blur(0.5px);
}

@keyframes confetti-burst {
  0% {
    transform: perspective(600px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.5);
    opacity: 1;
  }
  35% {
    transform: perspective(600px) translate3d(var(--dx), var(--dy), var(--dz)) rotateX(calc(var(--rx) * 0.5)) rotateY(calc(var(--ry) * 0.5)) rotateZ(calc(var(--rz) * 0.5)) scale(var(--peak));
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: perspective(600px) translate3d(calc(var(--dx) * 1.1), calc(var(--dy) + 180px), calc(var(--dz) - 40px)) rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(var(--rz)) scale(calc(var(--peak) * 0.9));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti-particle {
    animation: none;
    opacity: 0;
  }
}
</style>
