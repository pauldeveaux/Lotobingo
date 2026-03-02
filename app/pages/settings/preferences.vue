<script setup lang="ts">
import { useClientStyleStore } from '~/stores/useClientStyleStore'

const style = useClientStyleStore()
const bgImageInput = ref<HTMLInputElement | null>(null)

function onBgImageChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    style.backgroundImage = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
const bingoStore = useBingoStore()
const prizeStore = usePrizeStore()
const sponsorStore = useSponsorStore()
const { connect, syncBingo, syncPrize, syncSponsor, syncStyle, onRequestSync, isConnected } = useWebSocket()

const lotoInfo = computed(() => ({
  lotoName: bingoStore.lotoName,
  lotoSubtitle: bingoStore.lotoSubtitle,
  lotoLogo: bingoStore.lotoLogo,
}))

function syncAll(): void {
  syncBingo(bingoStore.bingo, lotoInfo.value)
  syncStyle(style.$state)
}

onMounted(() => {
  connect()
  onRequestSync(() => syncAll())
})

watch(isConnected, (connected) => {
  if (connected) syncAll()
})

// Sync style to client via WebSocket whenever it changes
watch(() => style.$state, () => {
  syncStyle(style.$state)
}, { deep: true })
</script>

<template>
  <div class="preferences-page">
    <h2 class="settings-title">Style</h2>

    <!-- En-tête -->
    <section class="settings-section">
      <h3>En-tête</h3>

      <div class="row">
        <div class="field">
          <label>Logo : {{ style.logoSize }}px</label>
          <input type="range" v-model.number="style.logoSize" min="24" max="128" step="4" />
        </div>
        <div class="field">
          <label>Titre : {{ style.titleFontSize }}rem</label>
          <input type="range" v-model.number="style.titleFontSize" min="1" max="4" step="0.25" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Sous-titre : {{ style.subtitleFontSize }}rem</label>
          <input type="range" v-model.number="style.subtitleFontSize" min="0.5" max="2.5" step="0.25" />
        </div>
        <div class="field">
          <label>Nom du tirage : {{ style.bingoNameFontSize }}rem</label>
          <input type="range" v-model.number="style.bingoNameFontSize" min="0.5" max="2.5" step="0.25" />
        </div>
      </div>

      <div class="color-row">
        <div class="color-field">
          <label>Titre</label>
          <input type="color" v-model="style.titleColor" />
        </div>
        <div class="color-field">
          <label>Sous-titre</label>
          <input type="color" v-model="style.subtitleColor" />
        </div>
        <div class="color-field">
          <label>Tirage</label>
          <input type="color" v-model="style.bingoNameColor" />
        </div>
      </div>
    </section>

    <!-- Général -->
    <section class="settings-section">
      <h3>Général</h3>

      <div class="row">
        <div class="field">
          <label>Taille de la grille : {{ style.gridSizePercent }}%</label>
          <input type="range" v-model.number="style.gridSizePercent" min="60" max="95" step="1" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Position X grille : {{ style.gridX }}%</label>
          <input type="range" v-model.number="style.gridX" min="0" max="100" step="1" />
        </div>
        <div class="field">
          <label>Position Y grille : {{ style.gridY }}%</label>
          <input type="range" v-model.number="style.gridY" min="0" max="100" step="1" />
        </div>
      </div>

      <div class="field checkbox-field">
        <label>
          <input type="checkbox" v-model="style.ballVolume" />
          Effet 3D sur les boules
        </label>
      </div>

      <div class="field">
        <label>Image de fond</label>
        <div class="bg-image-controls">
          <input ref="bgImageInput" type="file" accept="image/*" style="display:none" @change="onBgImageChange" />
          <button type="button" class="upload-btn" @click="(bgImageInput as HTMLInputElement).click()">
            {{ style.backgroundImage ? 'Changer l\'image' : 'Choisir une image' }}
          </button>
          <button v-if="style.backgroundImage" type="button" class="remove-btn" @click="style.backgroundImage = null">
            Supprimer
          </button>
        </div>
      </div>

      <div v-if="style.backgroundImage" class="field">
        <label>Opacité : {{ Math.round(style.backgroundImageOpacity * 100) }}%</label>
        <input type="range" v-model.number="style.backgroundImageOpacity" min="0" max="1" step="0.05" />
      </div>

      <div class="color-row">
        <div class="color-field">
          <label>Fond</label>
          <input type="color" v-model="style.backgroundColor" />
        </div>
        <div class="color-field">
          <label>Boule</label>
          <input type="color" v-model="style.ballColor" />
        </div>
        <div class="color-field">
          <label>Boule tirée</label>
          <input type="color" v-model="style.ballDrawnColor" />
        </div>
        <div class="color-field">
          <label>Animation</label>
          <input type="color" v-model="style.ballAnimationColor" />
        </div>
      </div>
    </section>

    <!-- Lot -->
    <section class="settings-section">
      <h3>Lot</h3>

      <div class="field checkbox-field">
        <label>
          <input type="checkbox" v-model="style.prizeVisible" />
          Afficher le lot
        </label>
      </div>

      <div class="row">
        <div class="field">
          <label>Position X : {{ style.prizeX }}%</label>
          <input type="range" v-model.number="style.prizeX" min="0" max="100" step="1" />
        </div>
        <div class="field">
          <label>Position Y : {{ style.prizeY }}%</label>
          <input type="range" v-model.number="style.prizeY" min="0" max="100" step="1" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Taille image : {{ style.prizeImageSize }}px</label>
          <input type="range" v-model.number="style.prizeImageSize" min="100" max="500" step="10" />
        </div>
      </div>

      <div class="color-row">
        <div class="color-field">
          <label>Panneau</label>
          <input type="color" v-model="style.prizePanelColor" />
        </div>
        <div class="color-field">
          <label>Badge</label>
          <input type="color" v-model="style.prizeBadgeColor" />
        </div>
        <div class="color-field">
          <label>Texte</label>
          <input type="color" v-model="style.prizeTextColor" />
        </div>
        <div class="color-field">
          <label>Valeur</label>
          <input type="color" v-model="style.prizeValueColor" />
        </div>
        <div class="color-field">
          <label>Offert par</label>
          <input type="color" v-model="style.prizeProviderLabelColor" />
        </div>
      </div>
    </section>

    <!-- Sponsor -->
    <section class="settings-section">
      <h3>Sponsor</h3>

      <div class="field checkbox-field">
        <label>
          <input type="checkbox" v-model="style.sponsorVisible" />
          Afficher le sponsor
        </label>
      </div>

      <div class="row">
        <div class="field">
          <label>Position X : {{ style.sponsorX }}%</label>
          <input type="range" v-model.number="style.sponsorX" min="0" max="100" step="1" />
        </div>
        <div class="field">
          <label>Position Y : {{ style.sponsorY }}%</label>
          <input type="range" v-model.number="style.sponsorY" min="0" max="100" step="1" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Taille image : {{ style.sponsorImageSize }}px</label>
          <input type="range" v-model.number="style.sponsorImageSize" min="100" max="500" step="10" />
        </div>
      </div>

      <div class="color-row">
        <div class="color-field">
          <label>Panneau</label>
          <input type="color" v-model="style.sponsorPanelColor" />
        </div>
        <div class="color-field">
          <label>Badge</label>
          <input type="color" v-model="style.sponsorBadgeColor" />
        </div>
        <div class="color-field">
          <label>Texte</label>
          <input type="color" v-model="style.sponsorTextColor" />
        </div>
      </div>
    </section>

    <button class="reset-btn" @click="style.resetToDefault()">
      Réinitialiser les valeurs par défaut
    </button>
  </div>
</template>

<style>
@import '~/assets/css/settings-editor.css';
</style>

<style scoped>
.preferences-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.settings-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

/* Two-column row for paired fields */
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.field {
  margin-bottom: 0.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.field select,
.field input[type="range"] {
  width: 100%;
}

.field select {
  padding: 0.45rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.85rem;
  background: white;
  color: #1f2937;
}

.field input[type="range"] {
  accent-color: #6366f1;
}

.checkbox-field {
  margin-bottom: 0.75rem;
}

.checkbox-field label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.checkbox-field input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
  cursor: pointer;
}

/* Color pickers in a horizontal row */
.color-row {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
  flex-wrap: wrap;
}

.color-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.color-field label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.color-field input[type="color"] {
  width: 36px;
  height: 36px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 2px;
  cursor: pointer;
  background: none;
}

.bg-image-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.upload-btn,
.remove-btn {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  transition: background 0.15s;
}

.upload-btn {
  background: #ede9fe;
  color: #4f46e5;
  border-color: #c4b5fd;
}

.upload-btn:hover {
  background: #ddd6fe;
}

.remove-btn {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}

.remove-btn:hover {
  background: #fecaca;
}

.reset-btn {
  align-self: center;
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.reset-btn:hover {
  background: #e5e7eb;
}
</style>
