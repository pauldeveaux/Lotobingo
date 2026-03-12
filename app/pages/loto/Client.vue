<script setup lang="ts">
/**
 * Client display page for bingo game.
 * Receives real-time updates via WebSocket and displays animated ball draws.
 */
import BingoGrid from "~/components/loto/BingoGrid.vue";
import AnimatedBall from "~/components/loto/client/AnimatedBall.vue";
import type { Position } from "~/types/bingo";
import { useClientStyleStore } from "~/stores/useClientStyleStore";

const {
  connect,
  bingoState,
  lotoName,
  lotoSubtitle,
  lotoLogo,
  prizeState,
  sponsorState,
  clientStyleState,
  isConnected,
  connectionError,
} = useWebSocket();
const clientStyle = useClientStyleStore();

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const bgColor = computed(() => {
  const opacity = clientStyle.backgroundColorOpacity ?? 1;
  return opacity < 1
    ? hexToRgba(clientStyle.backgroundColor, opacity)
    : clientStyle.backgroundColor;
});

const cssVars = computed(() => ({
  "--theme-bg-color": bgColor.value,
  "--theme-bingo-type-color": clientStyle.bingoTypeColor ?? "#f5576c",
  "--theme-title-color": clientStyle.titleColor,
  "--theme-title-font-size": `${clientStyle.titleFontSize}rem`,
  "--theme-ball-color": clientStyle.ballColor,
  "--theme-ball-drawn-color": clientStyle.ballDrawnColor,
  "--theme-prize-panel-color": clientStyle.prizePanelColor,
  "--theme-prize-badge-color": clientStyle.prizeBadgeColor,
  "--theme-prize-text-color": clientStyle.prizeTextColor,
  "--theme-prize-value-color": clientStyle.prizeValueColor,
  "--theme-prize-provider-label-color": clientStyle.prizeProviderLabelColor,
  "--theme-prize-image-size": `${clientStyle.prizeImageSize}px`,
  "--theme-sponsor-panel-color": clientStyle.sponsorPanelColor,
  "--theme-sponsor-badge-color": clientStyle.sponsorBadgeColor,
  "--theme-sponsor-text-color": clientStyle.sponsorTextColor,
  "--theme-sponsor-image-size": `${clientStyle.sponsorImageSize}px`,
}));

const showPrize = computed(
  () => prizeState.value && clientStyle.prizeVisible !== false,
);
const showSponsor = computed(
  () => sponsorState.value && clientStyle.sponsorVisible !== false,
);

definePageMeta({
  layout: false, // Full-screen display without navigation
});

// Animation state
const animatingNumber = ref<number | null>(null);
const animationKey = ref(0); // Forces re-render of AnimatedBall component
const targetPosition = ref<Position | null>(null);

// Apply style changes received via WebSocket
watch(clientStyleState, (newStyle) => {
  if (newStyle) {
    clientStyle.$patch(newStyle);
  }
});

onMounted(() => {
  connect();

  // Cross-tab sync: update store when settings change in another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "client-style-state" && e.newValue) {
      clientStyle.$patch(JSON.parse(e.newValue));
    }
  });
});

const balls = computed<number[]>(() => {
  if (!bingoState.value) return [];
  const { minNumber, maxNumber } = bingoState.value.settings;
  return Array.from(
    { length: maxNumber - minNumber + 1 },
    (_, i) => i + minNumber,
  );
});

// Trigger animation when a new number is drawn
watch(
  () => bingoState.value?.drawnNumbers?.length,
  (newLength, oldLength) => {
    const drawnNumbers = bingoState.value?.drawnNumbers;

    if (
      newLength === undefined ||
      !drawnNumbers ||
      newLength <= (oldLength ?? 0) ||
      newLength - (oldLength ?? 0) > 1 ||
      !bingoState.value
    ) {
      return;
    }

    const newNumber = drawnNumbers[drawnNumbers.length - 1];
    if (newNumber !== undefined) {
      triggerAnimation(newNumber);
    }
  },
);

/**
 * Calculates target position for ball animation (flies to its grid position).
 * Position is relative to screen center where the animated ball starts.
 */
function triggerAnimation(number: number): void {
  const targetBall = document.querySelector(`[data-number="${number}"]`);
  if (targetBall) {
    const rect = targetBall.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetPosition.value = {
      x: rect.left + rect.width / 2 - centerX,
      y: rect.top + rect.height / 2 - centerY,
    };
  }
  animationKey.value++;
  animatingNumber.value = number;
}

function onAnimationComplete(): void {
  animatingNumber.value = null;
  targetPosition.value = null;
}
</script>

<template>
  <div class="client-page">
    <!-- Full-page background image -->
    <div
      v-if="clientStyle.backgroundImage"
      class="bg-image"
      :style="{
        backgroundImage: `url(${clientStyle.backgroundImage})`,
        opacity: clientStyle.backgroundImageOpacity,
      }"
    />
    <!-- Color overlay on top of background image -->
    <div class="bg-overlay" :style="{ backgroundColor: bgColor }" />

    <div v-if="bingoState && isConnected" class="client-view" :style="cssVars">
      <div class="header-row">
        <img
          v-if="lotoLogo"
          :src="lotoLogo"
          alt="Logo"
          class="loto-logo"
          :style="{ height: `${clientStyle.logoSize}px` }"
        />
        <div class="header-text">
          <h1
            :style="{
              color: clientStyle.titleColor,
              fontSize: `${clientStyle.titleFontSize}rem`,
            }"
          >
            {{ lotoName || bingoState.settings.name }}
          </h1>
          <p
            v-if="lotoSubtitle"
            class="loto-subtitle"
            :style="{
              color: clientStyle.subtitleColor,
              fontSize: `${clientStyle.subtitleFontSize}rem`,
            }"
          >
            {{ lotoSubtitle }}
          </p>
          <p
            class="bingo-name"
            :style="{
              color: clientStyle.bingoNameColor,
              fontSize: `${clientStyle.bingoNameFontSize}rem`,
            }"
          >
            {{ bingoState.settings.name }}
            <span class="bingo-type">{{ bingoState.settings.type }}</span>
          </p>
        </div>
      </div>

      <div class="content-row">
        <!-- Bingo grid -->
        <BingoGrid
          :style="{
            position: 'absolute',
            left: `${clientStyle.gridX}%`,
            top: `${clientStyle.gridY}%`,
            transform: 'translate(-50%, -50%)',
          }"
          :numbers="balls"
          :drawn-numbers="bingoState.drawnNumbers"
          :cell-size-screen-percentage="clientStyle.gridSizePercent"
          :volume="clientStyle.ballVolume"
          :ball-config="{ hoverable: false, clickable: false }"
        />

        <!-- Prize -->
        <PrizeDisplay
          v-if="showPrize"
          :style="{
            position: 'absolute',
            left: `${clientStyle.prizeX}%`,
            top: `${clientStyle.prizeY}%`,
            transform: 'translate(-50%, -50%)',
          }"
          :name="prizeState?.name"
          :value="prizeState?.value"
          :photo="prizeState?.photo"
          :provider-name="prizeState?.providerName"
          :provider-image="prizeState?.providerImage"
        />

        <!-- Sponsor -->
        <SponsorDisplay
          v-if="showSponsor"
          :style="{
            position: 'absolute',
            left: `${clientStyle.sponsorX}%`,
            top: `${clientStyle.sponsorY}%`,
            transform: 'translate(-50%, -50%)',
          }"
          :name="sponsorState?.name"
          :image="sponsorState?.image"
        />
      </div>
    </div>

    <div v-else-if="!isConnected" class="status">
      <h1>Connexion en cours...</h1>
    </div>
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
      :color="clientStyle.ballAnimationColor"
    />

    <div v-if="connectionError" class="error-banner">
      {{ connectionError }}
    </div>
  </div>
</template>

<style scoped>
.client-page {
  position: relative;
  height: 100vh;
  overflow: visible;
  background-color: #0f172a;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.client-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bingo-type {
  padding: 0.15rem 0.6rem;
  font-size: 0.75em;
  font-weight: 600;
  border-radius: 20px;
  background-color: color-mix(
    in srgb,
    var(--theme-bingo-type-color) 20%,
    transparent
  );
  color: var(--theme-bingo-type-color);
}

.content-row {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: visible;
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
  height: 100%;
  position: relative;
  z-index: 2;
}
</style>
