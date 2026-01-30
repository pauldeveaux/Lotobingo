<script setup lang="ts">
import type { BallConfig } from '~/types/bingo'

/**
 * Responsive grid of bingo balls.
 * Switches to compact mode when container is too narrow.
 */
import Ball from '~/components/loto/Ball.vue'

interface Props {
    numbers: number[]
    ballConfig?: BallConfig
    drawnNumbers: number[]
    cellSizeScreenPercentage?: number | null
    compactColumns?: number
    maxHeight?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    cellSizeScreenPercentage: null,
    compactColumns: 5,
    maxHeight: null
})

const emits = defineEmits<{
    'draw-number': [number: number]
}>()

const gridRef = ref<HTMLDivElement | null>(null)
const isCompact = ref(false)

// Square grid: columns = sqrt of total numbers (e.g., 90 balls = 10 columns)
const defaultColumns = computed(() => Math.ceil(Math.sqrt(props.numbers.length)))

const columns = computed(() => {
    if (isCompact.value) {
        return props.compactColumns
    }
    return defaultColumns.value
})

// Auto-detect when grid needs to switch to compact mode
onMounted(() => {
    if (!props.cellSizeScreenPercentage && gridRef.value) {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width
                const minCellSize = 45
                const gap = 6
                const neededWidth = defaultColumns.value * minCellSize + (defaultColumns.value - 1) * gap
                isCompact.value = width < neededWidth
            }
        })
        observer.observe(gridRef.value)
        onUnmounted(() => observer.disconnect())
    }
})
</script>

<template>
    <div
        ref="gridRef"
        class="bingo-grid"
        :class="{ compact: isCompact }"
        :style="{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            height: cellSizeScreenPercentage ? `${cellSizeScreenPercentage}vh` : 'auto',
            width: cellSizeScreenPercentage ? `${cellSizeScreenPercentage}vh` : '100%',
            maxWidth: cellSizeScreenPercentage ? 'none' : '600px',
            maxHeight: maxHeight || 'none'
      }"
    >
        <ClientOnly>
            <div v-for="number in numbers" :key="number" class="ball-wrapper">
                <Ball
                    :number="number"
                    :config="ballConfig"
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
}
.bingo-grid.compact {
    overflow-y: auto;
    overflow-x: hidden;
}
.ball-wrapper {
    width: 100%;
    aspect-ratio: 1/1;
    overflow: visible;
}
</style>
