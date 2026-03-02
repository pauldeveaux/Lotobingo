<script setup lang="ts">
/**
 * Admin page for managing bingo draws.
 * Handles number drawing, game state, and WebSocket sync with clients.
 */
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import AddNumber from "~/components/loto/admin/AddNumber.vue";
import BingoGrid from "~/components/loto/BingoGrid.vue";
import Historic from "~/components/loto/admin/Historic.vue";
import BingoChoice from "~/components/loto/admin/BingoChoice.vue";
import PrizeSelector from "~/components/prize/PrizeSelector.vue";
import SponsorSelector from "~/components/sponsor/SponsorSelector.vue";
import CardVerificator from "~/components/card/CardVerificator.vue";
import { useClientStyleStore } from "~/stores/useClientStyleStore";

const bingoStore = useBingoStore();
const prizeStore = usePrizeStore();
const sponsorStore = useSponsorStore();
const clientStyleStore = useClientStyleStore();
const {
  connect,
  syncBingo,
  syncPrize,
  syncSponsor,
  syncStyle,
  onRequestSync,
  isConnected,
} = useWebSocket();

// Persist selected prize/sponsor IDs across reloads
function persistedRef(key: string) {
  const stored = import.meta.client ? localStorage.getItem(key) : null;
  const r = ref<number | null>(stored ? Number(stored) : null);
  watch(r, (v) => {
    if (import.meta.client) {
      v != null
        ? localStorage.setItem(key, String(v))
        : localStorage.removeItem(key);
    }
  });
  return r;
}

const selectedPrizeId = persistedRef("admin-selected-prize");
const selectedSponsorId = persistedRef("admin-selected-sponsor");

const selectedPrize = computed(() => {
  return selectedPrizeId.value
    ? prizeStore.getPrize(selectedPrizeId.value)
    : null;
});

const selectedSponsor = computed(() => {
  return selectedSponsorId.value
    ? sponsorStore.getSponsor(selectedSponsorId.value)
    : null;
});

// Sync prize whenever selection changes
watch(selectedPrizeId, () => {
  syncPrize(selectedPrize.value);
});

// Sync sponsor whenever selection changes
watch(selectedSponsorId, () => {
  syncSponsor(selectedSponsor.value);
});

// Sync bingo, prize and sponsor (initial sync, bingo change, reconnect)
const lotoInfo = computed(() => ({
  lotoName: bingoStore.lotoName,
  lotoSubtitle: bingoStore.lotoSubtitle,
  lotoLogo: bingoStore.lotoLogo,
}));

function syncAll(): void {
  syncBingo(bingoStore.bingo, lotoInfo.value);
  syncPrize(selectedPrize.value);
  syncSponsor(selectedSponsor.value);
  syncStyle(clientStyleStore.$state);
}

// Sync bingo WITHOUT prize (number draws, state changes)
function syncState(): void {
  syncBingo(bingoStore.bingo, lotoInfo.value);
}

// Initialize WebSocket and set up sync handler for new clients
onMounted(() => {
  connect();
  onRequestSync(() => {
    syncAll();
  });
});

// Sync state whenever connection is restored
watch(isConnected, (connected: boolean) => {
  if (connected) {
    syncAll();
  }
});

const errorMessage = ref<string>("");
const lastNumber = ref<number | null>(null);

/** Draws a number and broadcasts to connected clients */
function drawNumber(number: number): void {
  try {
    bingoStore.drawNumber(number);
    lastNumber.value = number;
    syncState();
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = (err as Error).message;
  }
}

function removeNumber(number: number): void {
  try {
    bingoStore.cancelDraw(number);
    syncBingo(bingoStore.bingo);
  } catch (err) {
    errorMessage.value = (err as Error).message;
  }
}

function toggleFinished(): void {
  bingoStore.toggleFinishCurrent();
  syncState();
}

function resetBingo(): void {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser le tirage ?")) {
    bingoStore.resetCurrent();
    lastNumber.value = null;
    syncState();
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Admin<span>istration</span></h1>
      <p class="current-game">
        {{ bingoStore.lotoName }} — {{ bingoStore.bingo.settings.name }}
      </p>
    </header>

    <div id="loto-view">
      <!-- Left column: Historic + Card Verificator -->
      <div class="left-column">
        <Historic id="historic" @cancel="removeNumber" />
        <div id="card-verificator" class="panel">
          <CardVerificator />
        </div>
      </div>

      <!-- Center: Grid + Controls -->
      <div class="center-column">
        <BingoGrid
          id="bingo-grid"
          @draw-number="drawNumber($event)"
          :numbers="bingoStore.balls"
          :drawn-numbers="bingoStore.drawnNumbers"
        />

        <div class="controls">
          <AddNumber
            class="add-number-wrapper"
            v-model:last-number="lastNumber"
            @add-number="drawNumber($event)"
          />
          <div id="action-buttons">
            <button id="reset-btn" @click="resetBingo">Réinitialiser</button>
            <button
              @click="toggleFinished"
              id="finish-btn"
              :class="{ finished: bingoStore.isFinished }"
            >
              {{ bingoStore.bingo.isFinished ? "Reprendre" : "Finaliser" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right column: Bingo choice -->
      <div class="right-column">
        <div id="bingo-choice" class="panel">
          <BingoChoice :title="'Choix du tirage'" />
        </div>
        <div id="prize-selector" class="panel">
          <PrizeSelector v-model="selectedPrizeId" />
        </div>
        <div id="sponsor-selector" class="panel">
          <SponsorSelector v-model="selectedSponsorId" />
        </div>
      </div>
    </div>

    <!-- ErrorMessage -->
    <ErrorMessage :message="errorMessage" @dismiss="errorMessage = ''" />
  </div>
</template>

<style scoped>
.admin-page {
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* Header */
.admin-header {
  text-align: center;
  flex-shrink: 0;
  padding-bottom: 0.25rem;
}

.admin-header h1 {
  font-size: 1.5rem;
  margin: 0;
  color: #1f2937;
  font-weight: 800;
}

.admin-header h1 span {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.current-game {
  margin: 0.15rem 0 0 0;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Main Grid Layout — center column = 10×52px cells + 9×6px gaps + 8px padding */
#loto-view {
  flex: 1;
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    calc(11 * 52px + 9 * 6px + 8px)
    minmax(0, 1fr);
  gap: 0.75rem;
  min-height: 0;
  overflow: hidden;
}

/* Left column - Historic at top, Prize at bottom */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

#historic {
  flex: 0 0 auto;
  height: 35%;
  min-height: 120px;
  overflow: hidden;
}

#historic :deep(.historic-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
}

#historic :deep(.overflow-wrapper) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

#historic :deep(h3) {
  margin: 0 0 0.5rem 0;
  padding: 0.5rem 0.6rem 0;
  font-size: 0.9rem;
}

#historic :deep(.historic-row) {
  padding: 0.4rem 0.6rem;
  width: 100%;
}

#historic :deep(.historic-row p) {
  font-size: 1rem;
}

#card-verificator,
#prize-selector,
#sponsor-selector {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

/* Center column */
.center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 0.5rem;
  min-height: 0;
  overflow-y: auto;
}

#bingo-grid {
  flex: 0 0 auto;
}

/* Controls under grid */
.controls {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin: 20px;
}

.add-number-wrapper {
  flex-shrink: 0;
}

.add-number-wrapper :deep(#add-number-form) {
  margin: 0.5rem auto;
  padding: 1rem;
}

#action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Right column - Bingo choice */
.right-column {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

#bingo-choice {
  flex: 0 0 auto;
  height: 35%;
  min-height: 120px;
  overflow: hidden;
}

#bingo-choice :deep(.bingo-choice) {
  min-width: unset;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#bingo-choice :deep(.bingo-choice-wrapper) {
  flex: 1;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
}

#bingo-choice :deep(.row-choice) {
  padding: 0.5rem 0.6rem;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

#bingo-choice :deep(.name) {
  min-width: 60px;
  font-size: 0.9rem;
}

#bingo-choice :deep(.extras) {
  display: none;
}

#bingo-choice :deep(.choice-btn) {
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
}

/* Panel styling - updated */
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Force side panel content to fit in narrow containers */
.left-column :deep(*),
.right-column :deep(*) {
  min-width: 0;
}

.left-column :deep(.historic-row) {
  width: 100%;
}

.right-column :deep(.bingo-choice) {
  min-width: unset;
}

.left-column :deep(.prize-name),
.left-column :deep(.prize-provider),
.left-column :deep(.sponsor-name),
.right-column :deep(.prize-name),
.right-column :deep(.prize-provider),
.right-column :deep(.sponsor-name),
.right-column :deep(.name) {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

#bingo-choice h3,
#bingo-choice :deep(h3) {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Buttons */
#action-buttons button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

#action-buttons button:hover {
  transform: translateY(-1px);
}

#reset-btn {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  border: 1px solid #d1d5db;
}

#reset-btn:hover {
  background: rgba(107, 114, 128, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#finish-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

#finish-btn:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

#finish-btn.finished {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
}

#finish-btn.finished:hover {
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.5);
}

/* Responsive */
@media (max-width: 1400px) {
  .controls {
    margin: 15px;
  }
}

@media (max-width: 900px) {
  .admin-page {
    height: auto;
    min-height: calc(100vh - 60px);
    overflow: auto;
    padding: 0.5rem;
  }

  .admin-header h1 {
    font-size: 1.25rem;
  }

  #loto-view {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
  }

  .left-column {
    grid-column: 1;
    grid-row: 1;
  }

  .right-column {
    grid-column: 2;
    grid-row: 1;
  }

  .center-column {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  #historic,
  #bingo-choice {
    height: auto;
    max-height: 200px;
  }

  #card-verificator,
  #prize-selector,
  #sponsor-selector {
    max-height: none;
  }

  #bingo-grid {
    max-width: min(100%, 70vh);
    max-height: 50vh;
  }

  .controls {
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px;
  }
}

/* Mobile: fully stacked single column */
@media (max-width: 600px) {
  .admin-page {
    height: auto;
    min-height: calc(100vh - 100px);
    overflow: auto;
    padding: 0.5rem;
  }

  .admin-header h1 {
    font-size: 1.1rem;
  }

  .admin-header h1 span {
    display: none;
  }

  .current-game {
    font-size: 0.75rem;
  }

  #loto-view {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: visible;
  }

  /* Reorder: bingo choice first, then grid+controls, then left column */
  .right-column {
    order: 1;
  }
  .center-column {
    order: 2;
  }
  .left-column {
    order: 3;
  }

  .left-column {
    overflow: visible;
  }

  .right-column {
    overflow: visible;
  }

  .center-column {
    overflow: visible;
  }

  #historic {
    height: auto;
    max-height: 150px;
  }

  #card-verificator,
  #prize-selector,
  #sponsor-selector {
    max-height: none;
  }

  #bingo-choice {
    height: auto;
    max-height: 150px;
  }

  #bingo-grid {
    max-width: 100%;
    max-height: 60vh;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    width: 100%;
    margin: 8px 0;
  }

  .add-number-wrapper {
    width: 100%;
  }

  .add-number-wrapper :deep(#add-number-form) {
    max-width: 100%;
    margin: 0;
    padding: 0.75rem;
  }

  #action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  #action-buttons button {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    min-height: 44px;
  }
}
</style>
