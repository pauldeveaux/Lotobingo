<script setup lang="ts">
import Dropdown from '~/components/ui/Dropdown'

const prizeStore = usePrizeStore();

const selectedIds = defineModel<number[]>({ default: () => [] });

function clearSelection() {
  selectedIds.value = [];
}

function isSelected(id: number): boolean {
  return selectedIds.value?.includes(id) ?? false;
}
</script>

<template>
  <Dropdown class="prize-dropdown">
    <template #dropdown-btn="{ toggle, isOpen }">
      <button type="button" class="dropdown-trigger" @click="toggle">
        <span class="trigger-text">
          {{
            selectedIds?.length
              ? `${selectedIds.length} lot(s) sélectionné(s)`
              : "Sélectionner des lots"
          }}
        </span>
        <span class="trigger-icon">{{ isOpen ? "▲" : "▼" }}</span>
      </button>
    </template>

    <div class="prize-list">
      <div class="prize-header">
        <span>Lots disponibles</span>
        <button
          v-if="selectedIds?.length"
          type="button"
          class="clear-btn"
          @click="clearSelection"
        >
          Tout effacer
        </button>
      </div>

      <label
        v-for="prize in prizeStore.prizeList"
        :key="prize.id"
        class="prize-row"
        :class="{ selected: isSelected(prize.id) }"
      >
        <input type="checkbox" :value="prize.id" v-model="selectedIds" />
        <span class="prize-name">{{ prize.name }}</span>
        <span class="prize-value">{{ prize.value }}€</span>
      </label>

      <div v-if="!prizeStore.prizeList.length" class="no-prizes">
        Aucun lot disponible
      </div>
    </div>
  </Dropdown>
</template>

<style scoped>
.prize-dropdown {
  flex: 1;
}

.dropdown-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dropdown-trigger:hover {
  border-color: #4a90e2;
}

.dropdown-trigger:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
  outline: none;
}

.trigger-text {
  color: #374151;
}

.trigger-icon {
  color: #9ca3af;
  font-size: 0.75rem;
}

.prize-list {
  min-width: 280px;
  padding: 8px 0;
}

.prize-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
}

.clear-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.prize-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s;
  width: auto;
  text-align: left;
  font-weight: normal;
}

.prize-row:hover {
  background: #f3f4f6;
}

.prize-row.selected {
  background: #eff6ff;
}

.prize-row input[type="checkbox"] {
  flex: none;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.prize-name {
  flex: 1;
  color: #1f2937;
}

.prize-value {
  color: #059669;
  font-weight: 600;
  font-size: 0.9rem;
}

.no-prizes {
  padding: 16px;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}
</style>
