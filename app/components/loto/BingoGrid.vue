<script setup lang="ts">
import type { BallConfig } from "~/types/bingo";

/**
 * Responsive grid of bingo balls.
 * Switches to compact mode when container is too narrow.
 */
import Ball from "~/components/loto/Ball.vue";

interface Props {
  numbers: number[];
  ballConfig?: BallConfig;
  drawnNumbers: number[];
  cellSizeScreenPercentage?: number | null;
  compactColumns?: number;
  maxHeight?: string | null;
  volume?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cellSizeScreenPercentage: null,
  compactColumns: 5,
  maxHeight: null,
});

const emits = defineEmits<{
  "draw-number": [number: number];
}>();

const gridRef = ref<HTMLDivElement | null>(null);
const isCompact = ref(false);

// Square grid: columns = sqrt of total numbers (e.g., 90 balls = 10 columns)
const defaultColumns = computed(() =>
  Math.ceil(Math.sqrt(props.numbers.length)),
);

const columns = computed(() => {
  if (isCompact.value) {
    return props.compactColumns;
  }
  return defaultColumns.value;
});

onMounted(() => {
  if (
    !props.cellSizeScreenPercentage &&
    gridRef.value &&
    gridRef.value.parentElement
  ) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        const minCellSize = 45;
        const gap = 6;

        const paddingSafety = 20;

        const neededWidth =
          defaultColumns.value * minCellSize +
          (defaultColumns.value - 1) * gap +
          paddingSafety;

        isCompact.value = width < neededWidth;
      }
    });
    observer.observe(gridRef.value.parentElement);
    onUnmounted(() => observer.disconnect());
  }
});
</script>

<template>
  <div
    ref="gridRef"
    class="bingo-grid"
    :class="{ compact: isCompact }"
    role="grid"
    aria-label="Bingo ball grid"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      ...(cellSizeScreenPercentage
        ? {
            height: `${cellSizeScreenPercentage}vh`,
            width: `${cellSizeScreenPercentage}vh`,
          }
        : {}),
      maxHeight: maxHeight || undefined,
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
</template>

<style scoped>
.bingo-grid {
  display: grid;
  gap: 6px;
  justify-self: center;
  padding: 4px;
  box-sizing: border-box;
}
.bingo-grid:not([style*="height"]) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
.bingo-grid.compact {
  overflow-y: auto;
  overflow-x: hidden;
  aspect-ratio: unset;
}
.ball-wrapper {
  width: 100%;
  aspect-ratio: 1/1;
  overflow: visible;
}
</style>
