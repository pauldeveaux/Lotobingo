<script setup lang="ts">
import type { CardType } from '~/types/card'
import Card from '~/components/card/Card.vue'

const cardStore = useCardStore()
const styleStore = useCardStyleStore()

function getStyleForCard(cardId: number) {
  if (styleStore.distributionMode === 'uni') {
    return styleStore.selectedStyle
  }
  const styleIndex = cardId % styleStore.styles.length
  return styleStore.styles[styleIndex]
}

const cardType = ref<CardType>('90-ball')
const cardCount = ref(10)

const lastGenerated = ref<number[]>([])
const isGenerating = ref(false)

async function onGenerate() {
  isGenerating.value = true
  lastGenerated.value = []

  // Allow UI to update before heavy computation
  await nextTick()

  // Use setTimeout to ensure the loading state is rendered
  setTimeout(() => {
    const newCards = cardStore.addCards(cardType.value, cardCount.value)
    lastGenerated.value = newCards.map(c => c.id)
    isGenerating.value = false
  }, 50)
}

const previewCards = computed(() => {
  return lastGenerated.value
    .slice(0, 3)
    .map(id => cardStore.getCard(id))
    .filter(c => c !== null)
})
</script>

<template>
  <div class="generate-container">
    <form class="generate-form" @submit.prevent="onGenerate">
      <div class="form-group">
        <label for="cardType">Type de bingo :</label>
        <select id="cardType" v-model="cardType" :disabled="isGenerating">
          <option value="90-ball">90 boules (Européen)</option>
          <option value="75-ball">75 boules (Américain)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="cardCount">Nombre de cartons :</label>
        <input
          type="number"
          id="cardCount"
          v-model.number="cardCount"
          min="1"
          max="3000"
          :disabled="isGenerating"
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="isGenerating">
        <span v-if="isGenerating" class="loading-content">
          <span class="spinner"></span>
          Génération en cours...
        </span>
        <span v-else>Générer</span>
      </button>
    </form>

    <!-- Loading overlay -->
    <div v-if="isGenerating" class="loading-section">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <p>Génération de {{ cardCount }} cartons...</p>
      </div>
    </div>

    <!-- Preview generated cards -->
    <div v-else-if="lastGenerated.length > 0" class="preview-section">
      <h3>Aperçu ({{ lastGenerated.length }} cartons générés)</h3>
      <div class="cards-preview">
        <Card
          v-for="card in previewCards"
          :key="card.id"
          :card="card"
          :cardStyle="getStyleForCard(card.id)"
        />
      </div>
      <p v-if="lastGenerated.length > 3" class="more-info">
        ... et {{ lastGenerated.length - 3 }} autres cartons
      </p>
      <p class="total-info">
        Total en mémoire : {{ cardStore.count }} cartons
      </p>
    </div>
  </div>
</template>

<style scoped>
.generate-container {
  max-width: 700px;
  margin: 0 auto;
}

.generate-form {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
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

.form-group input,
.form-group select {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #f9fafb;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.submit-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Loading section */
.loading-section {
  margin-top: 2rem;
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e5e7eb;
  border-top-color: #f093fb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-card p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Preview section */
.preview-section {
  margin-top: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.preview-section h3 {
  margin: 0 0 1.25rem 0;
  color: #1f2937;
  font-weight: 700;
}

.cards-preview {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.more-info {
  margin-top: 1.25rem;
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
}

.total-info {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}
</style>
