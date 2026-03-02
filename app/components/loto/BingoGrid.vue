<script setup lang="ts">
import type { BallConfig } from "~/types/bingo";

import Ball from "~/components/loto/Ball.vue";

interface Props {
  numbers: number[];
  ballConfig?: BallConfig;
  drawnNumbers: number[];
  cellSizeScreenPercentage?: number | null;
  maxHeight?: string | null;
  volume?: boolean;
  cellSize?: number;
  gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cellSizeScreenPercentage: null,
  maxHeight: null,
  cellSize: 52,
  gap: 6,
});

const emits = defineEmits<{
  "draw-number": [number: number];
}>();
</script>

<template>
  <div class="bingo-grid-wrapper">
    <div
      class="bingo-grid"
      role="grid"
      aria-label="Bingo ball grid"
      :style="{
        ...(cellSizeScreenPercentage
          ? {
              height: `${cellSizeScreenPercentage}vh`,
              width: `${cellSizeScreenPercentage}vh`,
              gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(numbers.length))}, 1fr)`,
            }
          : {
              gridTemplateColumns: `repeat(10, ${cellSize}px)`,
            }),
        gap: `${gap}px`,
      }"
    >
      <ClientOnly>
        <div v-for="number in numbers" :key="number" class="ball-wrapper">
          <Ball
            :number="number"
            :config="ballConfig"
            :volume="volume"
            :drawn="drawnNumbers.includes(number)"
            @click="emits('draw-number', number)"
          />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.bingo-grid-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
}
.bingo-grid {
  display: grid;
  padding: 4px;
  box-sizing: border-box;
}
.ball-wrapper {
  width: 100%;
  aspect-ratio: 1/1;
  overflow: visible;
}
</style>
