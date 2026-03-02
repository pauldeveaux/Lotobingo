<script setup lang="ts">
import type { Position } from "~/types/bingo";

/**
 * Animated ball reveal for client display.
 * Animation sequence: appear -> shuffle (random numbers) -> reveal -> fly to grid position
 */
interface Props {
  number: number;
  targetPosition: Position | null;
  color: String;
  onComplete?: () => void;
}

const props = defineProps<Props>();

type AnimationPhase = "appear" | "shuffle" | "show" | "fly";

const phase = ref<AnimationPhase>("appear");
const displayNumber = ref(props.number);


// Apply fly animation transform when in fly phase
const ballStyle = computed(() => {
  if (phase.value === "fly" && props.targetPosition) {
    return {
      transform: `translate(${props.targetPosition.x}px, ${props.targetPosition.y}px) scale(0.3)`,
      opacity: 0,
    };
  }
  return {};
});

let shuffleInterval: ReturnType<typeof setInterval> | null = null;
let timeouts: ReturnType<typeof setTimeout>[] = [];

/** Creates lottery-machine effect by rapidly changing displayed number */
function startShuffle(): void {
  shuffleInterval = setInterval(() => {
    displayNumber.value = Math.floor(Math.random() * 90) + 1;
  }, 50);
}

function stopShuffle(): void {
  if (shuffleInterval) {
    clearInterval(shuffleInterval);
    shuffleInterval = null;
  }
  displayNumber.value = props.number;
}

function clearAllTimeouts(): void {
  timeouts.forEach((id) => clearTimeout(id));
  timeouts = [];
}

// Orchestrate the 4-phase animation sequence
onMounted(() => {
  // Phase 1: Appear + start shuffling
  timeouts.push(
    setTimeout(() => {
      phase.value = "shuffle";
      startShuffle();
    }, 100),
  );

  // Phase 2: Stop shuffle, reveal real number
  timeouts.push(
    setTimeout(() => {
      stopShuffle();
      phase.value = "show";
    }, 1500),
  );

  // Phase 3: Fly to grid position
  timeouts.push(
    setTimeout(() => {
      phase.value = "fly";
    }, 5500),
  );

  // Phase 4: Cleanup
  timeouts.push(
    setTimeout(() => {
      props.onComplete?.();
    }, 6500),
  );
});

// Cleanup intervals and timeouts to prevent memory leaks
onUnmounted(() => {
  stopShuffle();
  clearAllTimeouts();
});
</script>

<template>
  <div class="overlay" :class="phase">
    <div
      class="animated-ball"
      :class="phase"
      :style="ballStyle"
    >
      <p>{{ displayNumber }}</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1000;
  background: rgba(0, 0, 0, 0);
  transition: background 0.4s ease;
}

.overlay.shuffle,
.overlay.show {
  background: rgba(0, 0, 0, 0.2);
}

.overlay.fly {
  background: rgba(0, 0, 0, 0);
  transition: background 0.5s ease;
}

.animated-ball {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, v-bind(color), color-mix(in srgb, v-bind(color) 40%, #000));
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(0);
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    inset 0 -5px 20px rgba(0, 0, 0, 0.3),
    inset 0 5px 20px rgba(255, 255, 255, 0.2);
}

.animated-ball p {
  color: white;
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.animated-ball.appear {
  transform: scale(0);
}

.animated-ball.shuffle {
  transform: scale(1);
  animation: shake 0.1s infinite;
}

.animated-ball.show {
  transform: scale(1.1);
  animation: pulse 0.3s ease;
}

.animated-ball.fly {
  transition:
    transform 0.5s ease-in,
    opacity 0.5s ease-in;
}

@keyframes shake {
  0%,
  100% {
    transform: scale(1) rotate(-2deg);
  }
  50% {
    transform: scale(1) rotate(2deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
