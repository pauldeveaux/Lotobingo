<script setup lang="ts">
/**
 * Client display page for bingo game.
 * Receives real-time updates via WebSocket and displays animated ball draws.
 */
import BingoGrid from '~/components/loto/BingoGrid.vue'
import AnimatedBall from '~/components/loto/client/AnimatedBall.vue'
import type { Position } from '~/types/bingo'

const { connect, bingoState, isConnected, connectionError } = useWebSocket()

definePageMeta({
    layout: false // Full-screen display without navigation
})

// Animation state
const animatingNumber = ref<number | null>(null)
const animationKey = ref(0) // Forces re-render of AnimatedBall component
const targetPosition = ref<Position | null>(null)

onMounted(
    () => connect()
)

const balls = computed<number[]>(() => {
    if (!bingoState.value) return []
    const { minNumber, maxNumber } = bingoState.value.settings
    return Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber)
})

// Trigger animation when a new number is drawn
watch(
    () => bingoState.value?.drawnNumbers?.length,
    (newLength, oldLength) => {
        const drawnNumbers = bingoState.value?.drawnNumbers

        if (newLength === undefined || !drawnNumbers || newLength <= (oldLength ?? 0) || newLength - (oldLength ?? 0) > 1|| !bingoState.value){
            return;
        }

        const newNumber = drawnNumbers[drawnNumbers.length - 1]
        if (newNumber !== undefined) {
            triggerAnimation(newNumber)
        }
    }
)

/**
 * Calculates target position for ball animation (flies to its grid position).
 * Position is relative to screen center where the animated ball starts.
 */
function triggerAnimation(number: number): void {
    const targetBall = document.querySelector(`[data-number="${number}"]`)
    if (targetBall) {
        const rect = targetBall.getBoundingClientRect()
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        targetPosition.value = {
            x: rect.left + rect.width / 2 - centerX,
            y: rect.top + rect.height / 2 - centerY
        }
    }
    animationKey.value++
    animatingNumber.value = number
}

function onAnimationComplete(): void {
    animatingNumber.value = null
    targetPosition.value = null
}
</script>

<template>
    <div v-if="!isConnected" class="status"><h1>Connexion en cours...</h1></div>
    <div v-else-if="!bingoState" class="status"><h1>En attente des données...</h1></div>
    <template v-else>
        <div class="client-view" >
            <h1>{{ bingoState.settings.name }}</h1>

            <BingoGrid
                :numbers="balls"
                :drawn-numbers="bingoState.drawnNumbers"
                :cell-size-screen-percentage="80"
                :ball-config="{
                    hoverable: false,
                    clickable: false
                }"
            />
        </div>

        <AnimatedBall
            v-if="animatingNumber"
            :key="animationKey"
            :number="animatingNumber"
            :target-position="targetPosition"
            :on-complete="onAnimationComplete"
        />
    </template>
        <div v-if="connectionError" class="error-banner">
        {{ connectionError }}
    </div>
    
</template>

<style scoped>
h1 {
    text-align: center;
}

.client-view {
    display: grid;
}

.error-banner {
    color: red;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
}

</style>