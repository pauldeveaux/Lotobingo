<script setup lang="ts">
const sponsorStore = useSponsorStore()

const selectedId = defineModel<number | null>({ default: null })

const isDiaporamaOn = ref<boolean>(false)
const intervalSeconds = ref<number>(15)

const formattedInterval = computed(() => {
  const min = Math.floor(intervalSeconds.value / 60)
  const sec = intervalSeconds.value % 60
  if (min > 0) {
    return `${min}min ${sec}s`
  }
  return `${sec}s`
})
const intervalId = ref<number | null>(null)

const selectedSponsor = computed(() => {
  return selectedId.value ? sponsorStore.getSponsor(selectedId.value) : null
})

function onSelectChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  selectedId.value = value ? Number(value) : null
}

watch(isDiaporamaOn, () => {
  if (isDiaporamaOn.value)
    onDiaporamaStart()
  else
    onDiaporamaEnd()
})

watch(intervalSeconds, () => {
  if (isDiaporamaOn.value) {
    onDiaporamaEnd()
    onDiaporamaStart()
  }
})

function onDiaporamaStart() {
  intervalId.value = setInterval(() => {
    const sponsors = sponsorStore.sponsorList
    const currentIndex = sponsors.findIndex(s => s.id === selectedId.value)
    const nextIndex = currentIndex < sponsors.length - 1 ? currentIndex + 1 : 0
    selectedId.value = sponsors[nextIndex]?.id ?? null
  }, intervalSeconds.value * 1000)
}

function onDiaporamaEnd() {
  clearInterval(intervalId.value!)
  intervalId.value = null
}

onUnmounted(() => {
  onDiaporamaEnd()
})
</script>

<template>
  <div class="sponsor-selector">
    <h3>Sponsor a afficher</h3>

    <!-- Dropdown -->
    <select
      :value="selectedId ?? ''"
      @change="onSelectChange"
      :disabled="isDiaporamaOn"
      class="sponsor-select"
    >
      <option v-if="sponsorStore.sponsorList.length === 0" value="" disabled selected>Aucun sponsor disponible</option>
      <option v-else value="">Aucun sponsor</option>
      <option
        v-for="sponsor in sponsorStore.sponsorList"
        :key="sponsor.id"
        :value="sponsor.id"
      >
        {{ sponsor.name }}
      </option>
    </select>

    <!-- Diaporama -->
    <div v-if="sponsorStore.sponsorList.length > 1" class="diaporama-section">
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

    <!-- Selected sponsor preview -->
    <div v-if="selectedSponsor" class="sponsor-card">
      <div v-if="selectedSponsor.image" class="sponsor-photo-wrapper">
        <img :src="selectedSponsor.image" :alt="selectedSponsor.name" class="sponsor-photo" />
      </div>
      <div class="sponsor-info">
        <p class="sponsor-name">{{ selectedSponsor.name }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="sponsorStore.sponsorList.length > 0" class="empty-state">
      <span class="empty-text">Aucun sponsor selectionne</span>
    </div>
  </div>
</template>

<style scoped>
.sponsor-selector {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.sponsor-selector h3 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

.sponsor-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sponsor-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sponsor-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Sponsor card preview */
.sponsor-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 10px;
  border: 1.5px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.sponsor-photo-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.sponsor-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sponsor-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.sponsor-name {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e40af;
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
  background: #3b82f6;
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
  accent-color: #3b82f6;
  cursor: pointer;
}

.interval-value {
  min-width: 50px;
  text-align: right;
  font-weight: 700;
  font-size: 0.85rem;
  color: #3b82f6;
  font-variant-numeric: tabular-nums;
}
</style>
