<script setup lang="ts">
const bingoStore = useBingoStore();
const prizeStore = usePrizeStore();

const bingoPrizes = computed(() => {
  return bingoStore.bingo.prizeIds
    .map(id => prizeStore.getPrize(id))
    .filter(prize => prize !== null);
})

const selectedId = defineModel<number | null>({ default: null });

const isDiaporamaOn = ref<boolean>(false);
const intervalSeconds = ref<number>(15);

// Format seconds as "Xmin Xs" or "Xs"
const formattedInterval = computed(() => {
  const min = Math.floor(intervalSeconds.value / 60);
  const sec = intervalSeconds.value % 60;
  if (min > 0) {
    return `${min}min ${sec}s`;
  }
  return `${sec}s`;
});
const intervalId = ref<number | null>(null);

const selectedPrize = computed(() => {
  return selectedId.value ? prizeStore.getPrize(selectedId.value) : null;
});

// Initialize and reset selection when bingo changes
watch(() => bingoStore.bingo.id, () => {
  selectedId.value = bingoPrizes.value[0]?.id ?? null;
}, { immediate: true });

function onSelectChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  selectedId.value = value ? Number(value) : null;
}

watch(isDiaporamaOn, () => {
  if (isDiaporamaOn.value)
    onDiaporamaStart()
  else
    onDiaporamaEnd();
})

// Restart interval when timer changes while diaporama is running
watch(intervalSeconds, () => {
  if (isDiaporamaOn.value) {
    onDiaporamaEnd();
    onDiaporamaStart();
  }
})



function onDiaporamaStart(){
  intervalId.value = setInterval(() => {
    const currentIndex = bingoPrizes.value.findIndex(p => p.id === selectedId.value);
    const nextIndex = currentIndex < bingoPrizes.value.length - 1 ? currentIndex + 1 : 0;
    selectedId.value = bingoPrizes.value[nextIndex]?.id ?? null;
  }, intervalSeconds.value * 1000);
}

function onDiaporamaEnd(){
  clearInterval(intervalId.value);
  intervalId.value = null;
}

onUnmounted(() => {
  onDiaporamaEnd();
})
</script> 

<template>
  <div class="prize-selector">
    <h3>Lot à afficher</h3>

    <!-- Dropdown -->
    <select
      :value="selectedId ?? ''"
      @change="onSelectChange"
      :disabled="isDiaporamaOn"
      class="prize-select"
    >
      <option v-if="bingoPrizes.length == 0" value="" disabled selected>Aucun lot disponible</option>
      <option v-else value="">Aucun lot</option>
      <option
        v-for="prize in bingoPrizes"
        :key="prize.id"
        :value="prize.id"
      >
        {{ prize.name }} ({{ prize.value }}€)
      </option>
    </select>

    <!-- Diaporama -->
    <div v-if="bingoPrizes.length > 1" class="diaporama-section">
      <label class="diaporama-toggle">
        <input type="checkbox" v-model="isDiaporamaOn" class="toggle-input"/>
        <span class="toggle-switch"></span>
        <span class="toggle-label">Diaporama</span>
      </label>

      <div class="diaporama-settings" :class="{ disabled: !isDiaporamaOn }">
        <span class="settings-label">Intervalle</span>
        <div class="slider-row">
          <input
            type="range"
            v-model="intervalSeconds"
            min="5"
            max="300"
            :disabled="!isDiaporamaOn"
            class="interval-slider"
          />
          <span class="interval-value">{{ formattedInterval }}</span>
        </div>
      </div>
    </div>

    <!-- Selected prize preview -->
    <div v-if="selectedPrize" class="prize-card">
      <div v-if="selectedPrize.photo" class="prize-photo-wrapper">
        <img :src="selectedPrize.photo" :alt="selectedPrize.name" class="prize-photo" />
      </div>
      <div class="prize-info">
        <p class="prize-name">{{ selectedPrize.name }}</p>
        <p class="prize-value">{{ selectedPrize.value }}€</p>
        <p v-if="selectedPrize.providerName" class="prize-provider">{{ selectedPrize.providerName }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="bingoPrizes.length > 0" class="empty-state">
      <span class="empty-icon">🎁</span>
      <span class="empty-text">Aucun lot sélectionné</span>
    </div>
  </div>
</template>

<style scoped>
.prize-selector {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.prize-selector h3 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

.prize-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.prize-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prize-select:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

/* Prize card preview */
.prize-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 10px;
  border: 1.5px solid #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
}

.prize-photo-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.prize-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.prize-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.prize-name {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #92400e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prize-value {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #16a34a;
}

.prize-provider {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Empty state */
.empty-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
}

.empty-icon {
  font-size: 1.1rem;
}

.empty-text {
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}

/* Diaporama section */
.diaporama-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.diaporama-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  position: relative;
  width: 36px;
  height: 20px;
  background: #d1d5db;
  border-radius: 10px;
  flex-shrink: 0;
  transition: background 0.25s;
}

.toggle-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s;
}

.toggle-input:checked + .toggle-switch {
  background: #f59e0b;
}

.toggle-input:checked + .toggle-switch::after {
  transform: translateX(16px);
}

.toggle-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
}

.diaporama-settings {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-top: 0.35rem;
  border-top: 1px solid #e5e7eb;
  transition: opacity 0.2s;
}

.diaporama-settings.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.settings-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.interval-slider {
  flex: 1;
  height: 4px;
  accent-color: #f59e0b;
  cursor: pointer;
}

.interval-value {
  min-width: 50px;
  text-align: right;
  font-weight: 700;
  font-size: 0.85rem;
  color: #f59e0b;
  font-variant-numeric: tabular-nums;
}
</style>
