<script setup lang="ts">
/**
 * Client display page for bingo game.
 * Receives real-time updates via WebSocket and displays animated ball draws.
 */
import BingoGrid from '~/components/loto/BingoGrid.vue'
import AnimatedBall from '~/components/loto/client/AnimatedBall.vue'
import type { Position } from '~/types/bingo'
import { useClientStyleStore } from '~/stores/useClientStyleStore'

const { connect, bingoState, lotoName, lotoSubtitle, lotoLogo, prizeState, sponsorState, isConnected, connectionError } = useWebSocket()
const clientStyle = useClientStyleStore()

const cssVars = computed(() => ({
  '--theme-bg-color': clientStyle.backgroundColor,
  '--theme-title-color': clientStyle.titleColor,
  '--theme-title-font-size': `${clientStyle.titleFontSize}rem`,
  '--theme-ball-color': clientStyle.ballColor,
  '--theme-ball-drawn-color': clientStyle.ballDrawnColor,
  '--theme-prize-panel-color': clientStyle.prizePanelColor,
  '--theme-prize-badge-color': clientStyle.prizeBadgeColor,
  '--theme-prize-text-color': clientStyle.prizeTextColor,
  '--theme-prize-value-color': clientStyle.prizeValueColor,
  '--theme-prize-provider-label-color': clientStyle.prizeProviderLabelColor,
  '--theme-prize-image-size': `${clientStyle.prizeImageSize}px`,
  '--theme-sponsor-panel-color': clientStyle.sponsorPanelColor,
  '--theme-sponsor-badge-color': clientStyle.sponsorBadgeColor,
  '--theme-sponsor-text-color': clientStyle.sponsorTextColor,
  '--theme-sponsor-image-size': `${clientStyle.sponsorImageSize}px`,
}))

const showPrize = computed(() => prizeState.value && clientStyle.prizePosition !== 'hidden')
const showSponsor = computed(() => sponsorState.value && clientStyle.sponsorPosition !== 'hidden')

// Layout adapts based on grid position:
// - center: 1fr auto 1fr (true centering), prize/sponsor go left/right based on their setting
// - left:   auto 1fr    grid col 1, side panels col 2
// - right:  1fr auto    side panels col 1, grid col 2
const layoutColumns = computed(() => {
  switch (clientStyle.gridPosition) {
    case 'center': return '1fr auto 1fr'
    case 'left': return 'auto 1fr'
    case 'right': return '1fr auto'
  }
})

const gridCol = computed(() => {
  if (clientStyle.gridPosition === 'center') return 2
  if (clientStyle.gridPosition === 'left') return 1
  return 2
})

// When grid is centered, prize/sponsor respect their left/right setting.
// When grid is left/right, all side panels go to the opposite side.
const prizeOnLeft = computed(() => {
  if (!showPrize.value) return false
  if (clientStyle.gridPosition === 'center') return clientStyle.prizePosition === 'left'
  return clientStyle.gridPosition === 'right'
})
const prizeOnRight = computed(() => {
  if (!showPrize.value) return false
  if (clientStyle.gridPosition === 'center') return clientStyle.prizePosition === 'right'
  return clientStyle.gridPosition === 'left'
})
const sponsorOnLeft = computed(() => {
  if (!showSponsor.value) return false
  if (clientStyle.gridPosition === 'center') return clientStyle.sponsorPosition === 'left'
  return clientStyle.gridPosition === 'right'
})
const sponsorOnRight = computed(() => {
  if (!showSponsor.value) return false
  if (clientStyle.gridPosition === 'center') return clientStyle.sponsorPosition === 'right'
  return clientStyle.gridPosition === 'left'
})

const showLeftSide = computed(() => prizeOnLeft.value || sponsorOnLeft.value)
const showRightSide = computed(() => prizeOnRight.value || sponsorOnRight.value)
const rightSideCol = computed(() => clientStyle.gridPosition === 'center' ? 3 : 2)

definePageMeta({
    layout: false // Full-screen display without navigation
})

// Animation state
const animatingNumber = ref<number | null>(null)
const animationKey = ref(0) // Forces re-render of AnimatedBall component
const targetPosition = ref<Position | null>(null)

onMounted(() => {
    connect()

    // Cross-tab sync: update store when settings change in another tab
    window.addEventListener('storage', (e) => {
        if (e.key === 'client-style-state' && e.newValue) {
            clientStyle.$patch(JSON.parse(e.newValue))
        }
    })
})

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
    <div v-if="bingoState && isConnected" class="client-view"
        :style="{ ...cssVars, backgroundColor: clientStyle.backgroundColor }">
            <div class="header-row">
                <img v-if="lotoLogo" :src="lotoLogo" alt="Logo" class="loto-logo"
                    :style="{ height: `${clientStyle.logoSize}px` }" />
                <div class="header-text">
                    <h1 :style="{ color: clientStyle.titleColor, fontSize: `${clientStyle.titleFontSize}rem` }">
                        {{ lotoName || bingoState.settings.name }}
                    </h1>
                    <p v-if="lotoSubtitle" class="loto-subtitle"
                        :style="{ color: clientStyle.subtitleColor, fontSize: `${clientStyle.subtitleFontSize}rem` }">
                        {{ lotoSubtitle }}
                    </p>
                    <p class="bingo-name"
                        :style="{ color: clientStyle.bingoNameColor, fontSize: `${clientStyle.bingoNameFontSize}rem` }">
                        {{ bingoState.settings.name }}
                    </p>
                </div>
            </div>

            <div class="content-row" :style="{ gridTemplateColumns: layoutColumns }">
                <!-- Left side panels -->
                <div v-if="showLeftSide" class="side-column" :style="{ gridColumn: 1, gridRow: 1 }">
                    <PrizeDisplay v-if="prizeOnLeft"
                        :name="prizeState?.name"
                        :value="prizeState?.value"
                        :photo="prizeState?.photo"
                        :provider-name="prizeState?.providerName"
                        :provider-image="prizeState?.providerImage"
                    />
                    <SponsorDisplay v-if="sponsorOnLeft"
                        :name="sponsorState?.name"
                        :image="sponsorState?.image"
                    />
                </div>

                <!-- Bingo grid -->
                <BingoGrid class="bingo-grid"
                    :style="{ gridColumn: gridCol, gridRow: 1 }"
                    :numbers="balls"
                    :drawn-numbers="bingoState.drawnNumbers"
                    :cell-size-screen-percentage="clientStyle.gridSizePercent"
                    :volume="clientStyle.ballVolume"
                    :ball-config="{ hoverable: false, clickable: false }"
                />

                <!-- Right side panels -->
                <div v-if="showRightSide" class="side-column" :style="{ gridColumn: rightSideCol, gridRow: 1 }">
                    <PrizeDisplay v-if="prizeOnRight"
                        :name="prizeState?.name"
                        :value="prizeState?.value"
                        :photo="prizeState?.photo"
                        :provider-name="prizeState?.providerName"
                        :provider-image="prizeState?.providerImage"
                    />
                    <SponsorDisplay v-if="sponsorOnRight"
                        :name="sponsorState?.name"
                        :image="sponsorState?.image"
                    />
                </div>
            </div>
        </div>

    <div v-else-if="!isConnected" class="status"><h1>Connexion en cours...</h1></div>
    <div v-else class="status">
        <h1>En attente d'une connexion ...</h1>
        <p>Veuillez lancer une instance d'administration</p>
    </div>

    <AnimatedBall
        v-if="animatingNumber"
        :key="animationKey"
        :number="animatingNumber"
        :target-position="targetPosition"
        :on-complete="onAnimationComplete"
    />

    <div v-if="connectionError" class="error-banner">
        {{ connectionError }}
    </div>

    
</template>

<style scoped>
.client-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 100vh;
    box-sizing: border-box;
}

.header-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.loto-logo {
    width: auto;
    object-fit: contain;
}

.header-text {
    text-align: center;
}

h1 {
    margin: 0;
}

.loto-subtitle {
    margin: 0.1rem 0 0 0;
}

.bingo-name {
    margin: 0.2rem 0 0 0;
    font-weight: 500;
}

.content-row {
    flex: 1;
    display: grid;
    gap: 1rem;
    align-items: center;
    min-height: 0;
}

.side-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.error-banner {
    color: red;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
}

.status {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
}
</style>