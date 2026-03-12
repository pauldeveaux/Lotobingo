<script setup lang="ts">
import CardStyleForm from "~/components/card/CardStyleForm.vue";
import Card from "~/components/card/Card.vue"

const styleStore = useCardStyleStore()

const activeStyleIndex = ref(0)
const currentStyle = computed(() => styleStore.styles[activeStyleIndex.value] ?? styleStore.styles[0])

const exampleCard = createCard(-1, "Carton #0000", "90-ball")

const opacityPercent = computed({
  get: () => Math.round((currentStyle.value.backgroundOverlayOpacity ?? 0.7) * 100),
  set: (v: number) => {
    styleStore.updateStyle(activeStyleIndex.value, { backgroundOverlayOpacity: v / 100 })
  }
})

const previewStyle = computed(() => {
  const img = currentStyle.value.backgroundImage
  const color = currentStyle.value.background
  const opacity = currentStyle.value.backgroundOverlayOpacity ?? 0.7
  if (!img) return { background: 'transparent' }
  return {
    backgroundImage: `url('${img}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '--overlay-color': color,
    '--overlay-opacity': String(opacity),
  }
})

function addStyle() {
  styleStore.addStyle()
  activeStyleIndex.value = styleStore.styles.length - 1
}

function removeStyle(index: number) {
  styleStore.removeStyle(index)
  if (activeStyleIndex.value >= styleStore.styles.length) {
    activeStyleIndex.value = styleStore.styles.length - 1
  }
}
</script>

<template>
  <div class="style-container">
    <form class="style-form" @submit.prevent>
      <div class="form-group">
        <label for="color-mode-select">Cartons de couleurs :</label>
        <select id="color-mode-select" v-model="styleStore.distributionMode">
          <option value="uni">Uniforme</option>
          <option value="random">Aléatoire</option>
        </select>
      </div>

      <!-- Background image + overlay -->
      <div class="bg-section">
        <div class="bg-section-title">Image de fond</div>
        <div class="bg-fields">
          <div class="bg-field">
            <label for="bg-image">URL de l'image</label>
            <input
              type="text"
              id="bg-image"
              :value="currentStyle.backgroundImage"
              @input="styleStore.updateStyle(activeStyleIndex, { backgroundImage: ($event.target as HTMLInputElement).value })"
              placeholder="https://..."
              class="text-input"
            />
          </div>
          <div class="bg-field bg-field--row">
            <div class="color-field">
              <label for="overlay-color">Couleur</label>
              <div class="input-wrapper">
                <input
                  type="color"
                  id="overlay-color"
                  :value="currentStyle.background"
                  @input="styleStore.updateStyle(activeStyleIndex, { background: ($event.target as HTMLInputElement).value })"
                />
                <span class="color-value">{{ currentStyle.background }}</span>
              </div>
            </div>
            <div class="opacity-field">
              <label for="overlay-opacity">Opacité <span class="opacity-value">{{ opacityPercent }}%</span></label>
              <input
                type="range"
                id="overlay-opacity"
                v-model="opacityPercent"
                min="0"
                max="100"
                step="1"
                class="range-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="styles-list">
        <div
          v-for="(style, index) in styleStore.styles"
          :key="style.id"
          class="style-item"
          :class="{
            active: index === activeStyleIndex,
            selected: styleStore.distributionMode === 'uni' && index === styleStore.selectedStyleIndex
          }"
          @click="activeStyleIndex = index"
        >
          <span
            v-if="styleStore.distributionMode === 'uni' && index === styleStore.selectedStyleIndex"
            class="selected-badge"
          >
            ✓
          </span>
          <CardStyleForm v-model="styleStore.styles[index]" />
          <button
            v-if="styleStore.distributionMode === 'uni' && index !== styleStore.selectedStyleIndex"
            type="button"
            class="select-btn"
            @click.stop="styleStore.selectStyle(index)"
          >
            Utiliser
          </button>
          <button
            v-if="styleStore.styles.length > 1"
            type="button"
            class="remove-btn"
            @click.stop="removeStyle(index)"
          >
            Supprimer
          </button>
        </div>
      </div>

      <button
        type="button"
        class="add-btn"
        @click="addStyle"
      >
        + Ajouter un style
      </button>
    </form>

    <!-- Live preview -->
    <div class="preview-section">
      <h3>Aperçu</h3>
      <div class="preview-bg" :style="previewStyle">
        <div v-if="currentStyle.backgroundImage" class="preview-overlay" />
        <Card
          :card="exampleCard"
          :showName="true"
          :showDelete="false"
          :cardStyle="currentStyle"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  .style-container {
    grid-template-columns: 1fr;
  }
}

.style-form {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-group label {
  min-width: 160px;
  font-weight: 600;
  color: #374151;
}

.form-group select {
  flex: 1;
  max-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

/* Background image section */
.bg-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  background: #f9fafb;
}

.bg-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 0.75rem;
}

.bg-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bg-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bg-field--row {
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
}

.color-field, .opacity-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.opacity-field {
  flex: 1;
}

.bg-field label, .color-field label, .opacity-field label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.opacity-value {
  font-weight: 700;
  color: #374151;
  font-family: monospace;
}

.text-input {
  padding: 0.4rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
  color: #374151;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

.range-input {
  width: 100%;
  accent-color: #f093fb;
  cursor: pointer;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

input[type="color"] {
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: none;
  padding: 0;
  border-radius: 4px;
}

.color-value {
  font-family: monospace;
  font-size: 0.75rem;
  color: #475569;
}

.styles-list {
  max-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.styles-list::-webkit-scrollbar {
  width: 6px;
}

.styles-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.styles-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.styles-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.style-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  transition: all 0.2s;
}

.style-item:hover {
  background: white;
  border-color: #d1d5db;
}

.style-item.active {
  border-color: #f093fb;
  background: #fdf4ff;
  box-shadow: 0 2px 10px rgba(240, 147, 251, 0.15);
}

.style-item.selected {
  border-color: #10b981;
  background: #ecfdf5;
}

.style-item.selected.active {
  border-color: #10b981;
}

.selected-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.select-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);
}

.select-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.remove-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.remove-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.preview-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 1rem;
}

.preview-section h3 {
  margin: 0 0 1.25rem 0;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.1rem;
}

.preview-bg {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: inline-block;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--overlay-color);
  opacity: var(--overlay-opacity);
  pointer-events: none;
}
</style>
