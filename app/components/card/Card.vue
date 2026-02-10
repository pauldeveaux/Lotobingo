<script setup lang="ts">
import type { Card } from '~/types/card'

interface Props {
  card: Card
  showName?: boolean
  showDelete?: boolean
  cardStyle?: CardStyleConfig
  highlightedNumbers?: Set<number>
}

interface CardStyleConfig {
  background: string
  number: string
  title: string
  numberBox: string
  emptyBox: string
}

const props = withDefaults(defineProps<Props>(), {
  showName: true,
  showDelete: false,
  cardStyle: () => ({
    background: '#f9fafb',
    number: '#000000',
    title: '#000000',
    numberBox: '#ffffff',
    emptyBox: '#f3f4f6'
  }),
  highlightedNumbers: () => new Set<number>()
})

const emit = defineEmits<{
  delete: [id: number]
}>()

const cssVars = computed(() => ({
  '--card-bg': props.cardStyle.background,
  '--card-text': props.cardStyle.number,
  '--card-title': props.cardStyle.title,
  '--cell-bg': props.cardStyle.numberBox,
  '--empty-cell-bg': props.cardStyle.emptyBox,
}))
</script>

<template>
  <div class="bingo-card" :class="card.type" :style="cssVars">
    <div v-if="showName || showDelete" class="card-header">
      <p v-if="showName" class="card-name">{{ card.name }}</p>
      <button
        v-if="showDelete"
        class="delete-btn"
        @click="emit('delete', card.id)"
        title="Supprimer"
      >
        ×
      </button>
    </div>
    <table class="card-grid">
      <tr v-for="(row, rowIdx) in card.value" :key="rowIdx">
        <td
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          :class="{
            empty: cell === null,
            free: cell === null && card.type === '75-ball' && rowIdx === 2 && colIdx === 2,
            highlighted: cell !== null && highlightedNumbers.has(cell)
          }"
        >
          <template v-if="cell !== null">{{ cell }}</template>
          <template v-else-if="card.type === '75-ball' && rowIdx === 2 && colIdx === 2">★</template>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.bingo-card {
  background: var(--card-bg);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  display: inline-block;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--card-title)
}

.delete-btn {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #9ca3af;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-grid {
  border-collapse: collapse;
}

.card-grid td {
  width: 32px;
  height: 32px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  background: var(--cell-bg);
  color: var(--card-text);
}

/* 75-ball has larger cells */
.bingo-card.\37 5-ball .card-grid td {
  width: 36px;
  height: 36px;
  font-size: 0.85rem;
}

.card-grid td.empty {
  background: var(--empty-cell-bg);
}

.card-grid td.free {
  background: #fef3c7;
  color: #f59e0b;
  font-size: 1rem;
}

.card-grid td.highlighted {
  background: #d1fae5;
  color: #065f46;
  font-weight: 700;
}
</style>
