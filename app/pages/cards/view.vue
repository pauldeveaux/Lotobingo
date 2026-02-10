<script setup lang="ts">
import type { CardType } from '~/types/card'
import Card from '~/components/card/Card.vue'

const cardStore = useCardStore()
const styleStore = useCardStyleStore()

function getStyleForCard(cardId: number) {
  if (styleStore.distributionMode === 'uni') {
    return styleStore.selectedStyle
  }
  // Use card id to get consistent style distribution
  const styleIndex = cardId % styleStore.styles.length
  return styleStore.styles[styleIndex]
}

// Pagination
const page = ref(1)
const pageSize = ref(5)

// Filters
const filterType = ref<CardType | 'all'>('all')

// Filtered cards
const filteredCards = computed(() => {
  if (filterType.value === 'all') {
    return cardStore.cardList
  }
  return cardStore.cardsByType(filterType.value)
})

// Pagination computed
const totalPages = computed(() => Math.ceil(filteredCards.value.length / pageSize.value) || 1)
const startIdx = computed(() => (page.value - 1) * pageSize.value)
const endIdx = computed(() => startIdx.value + pageSize.value)
const paginatedCards = computed(() => filteredCards.value.slice(startIdx.value, endIdx.value))

// Reset to page 1 when filter changes
watch(filterType, () => {
  page.value = 1
})

// Keep page in bounds
watch(totalPages, (newTotal) => {
  if (page.value > newTotal) {
    page.value = newTotal
  }
})

function goToPage(p: number) {
  page.value = Math.max(1, Math.min(p, totalPages.value))
}

function deleteCard(id: number) {
  if (confirm('Supprimer ce carton ?')) {
    cardStore.deleteCard(id)
  }
}

function clearAll() {
  if (confirm(`Supprimer tous les cartons (${filteredCards.value.length}) ?`)) {
    if (filterType.value === 'all') {
      cardStore.clearAll()
    } else {
      cardStore.clearByType(filterType.value)
    }
  }
}
</script>

<template>
  <div class="view-container">
    <!-- Header with filters -->
    <div class="header">
      <div class="stats">
        <span class="count">{{ filteredCards.length }} cartons</span>
        <span v-if="filterType !== 'all'" class="filter-badge">{{ filterType }}</span>
      </div>

      <div class="filters">
        <select v-model="filterType" class="filter-select">
          <option value="all">Tous les types</option>
          <option value="90-ball">90 boules</option>
          <option value="75-ball">75 boules</option>
        </select>

        <select v-model.number="pageSize" class="page-size-select">
          <option :value="5">5 par page</option>
          <option :value="10">10 par page</option>
          <option :value="20">20 par page</option>
          <option :value="50">50 par page</option>
        </select>

        <button v-if="filteredCards.length > 0" class="clear-btn" @click="clearAll">
          Tout supprimer
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredCards.length === 0" class="empty-state">
      <p>Aucun carton disponible</p>
      <NuxtLink to="/cards/generate" class="generate-link">Générer des cartons</NuxtLink>
    </div>

    <!-- Cards grid -->
    <div v-else class="cards-grid">
      <Card
        v-for="card in paginatedCards"
        :key="card.id"
        :card="card"
        :cardStyle="getStyleForCard(card.id)"
        show-delete
        @delete="deleteCard"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="page <= 1"
        @click="page = 1"
        title="Première page"
      >
        ««
      </button>
      <button
        class="page-btn"
        :disabled="page <= 1"
        @click="page--"
      >
        Précédent
      </button>

      <div class="page-indicator">
        <input
          type="number"
          :value="page"
          @change="goToPage(Number(($event.target as HTMLInputElement).value))"
          min="1"
          :max="totalPages"
          class="page-input"
        />
        <span class="page-total">/ {{ totalPages }}</span>
      </div>

      <button
        class="page-btn"
        :disabled="page >= totalPages"
        @click="page++"
      >
        Suivant
      </button>
      <button
        class="page-btn"
        :disabled="page >= totalPages"
        @click="page = totalPages"
        title="Dernière page"
      >
        »»
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  max-width: 1200px;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.count {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.filter-badge {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.filter-select,
.page-size-select {
  padding: 0.6rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-select:focus,
.page-size-select:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

.clear-btn {
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Cards grid */
.cards-grid {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  align-content: start;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.cards-grid::-webkit-scrollbar {
  width: 6px;
}

.cards-grid::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #6b7280;
}

.generate-link {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.generate-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.page-btn {
  padding: 0.6rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.75rem;
}

.page-input {
  width: 55px;
  padding: 0.6rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.page-input:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
}

.page-total {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
