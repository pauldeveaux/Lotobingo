<script setup lang="ts">
import type { Prize } from '~/types/bingo'

const prizeStore = usePrizeStore()

interface Props {
  selectedId?: number | null
  showCreate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: undefined,
  showCreate: false,
})

const emits = defineEmits<{
  select: [id: number]
  create: []
  delete: [id: number]
}>()

function onSelect(id: number): void {
  emits('select', id)
}

function onDelete(id: number, event: Event): void {
  event.stopPropagation()
  if (confirm('Supprimer ce lot ?')) {
    emits('delete', id)
  }
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
</script>

<template>
  <div class="prize-list">
    <ul>
      <li
        v-for="prize in prizeStore.prizeList"
        :key="prize.id"
        class="prize-item"
        :class="{ active: prize.id === selectedId }"
        @click="onSelect(prize.id)"
      >
        <div class="prize-photo">
          <img v-if="prize.photo" :src="prize.photo" :alt="prize.name" />
          <div v-else class="no-photo">?</div>
        </div>

        <div class="prize-info">
          <p class="prize-name">{{ prize.name }}</p>
          <p class="prize-value">{{ formatPrice(prize.value) }}</p>
          <p v-if="prize.providerName" class="prize-provider">{{ prize.providerName }}</p>
        </div>

        <button class="delete-btn" @click="onDelete(prize.id, $event)">X</button>
      </li>

      <li v-if="showCreate" class="prize-item create-item" :class="{ active: selectedId === null }" @click="emits('create')">
        <span class="create-icon">+</span>
        <p class="create-text">Nouveau lot</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.prize-list {
  width: 100%;
  overflow-y: auto;
  max-height: 60vh;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prize-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f7f7f7;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.prize-item:hover {
  background: #eaeaea;
}

.prize-item.active {
  background: #dbeafe;
  box-shadow: inset 0 0 0 1px #3b82f6;
}

.prize-photo {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.prize-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.no-photo {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.5rem;
}

.prize-info {
  flex: 1;
  min-width: 0;
}

.prize-name {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prize-value {
  margin: 0;
  color: #22c55e;
  font-size: 0.9rem;
  font-weight: 500;
}

.prize-provider {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.create-item {
  border: 2px dashed #cbd5e1;
  background: transparent;
  justify-content: center;
}

.create-item:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.create-icon {
  font-size: 1.5rem;
  color: #94a3b8;
}

.create-text {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

.create-item:hover .create-icon,
.create-item:hover .create-text {
  color: #3b82f6;
}
</style>
