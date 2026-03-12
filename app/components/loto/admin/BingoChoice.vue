<script setup lang="ts">
import draggable from 'vuedraggable';
import type { Bingo } from '~/types/bingo';

/**
 * Component for selecting and switching between bingo games.
 * Syncs the selected game to connected clients when syncToStore is true.
 */
const bingoStore = useBingoStore();
const prizeStore = usePrizeStore();
const { syncBingo } = useWebSocket();

const emits = defineEmits(['create', 'choice', 'delete']);

interface Props {
  title?: string;
  showCreate?: boolean;
  showDelete?: boolean;
  syncToStore?: boolean;
  selectedId?: number | null;
  draggable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCreate: false,
  showDelete: false,
  syncToStore: true,
  selectedId: undefined,
  draggable: false,
});

// Local copy for drag and drop
const localBingos = ref<Bingo[]>([]);

// Sync from store to local when store changes
watch(
  () => bingoStore.sortedBingos,
  (sorted) => {
    localBingos.value = [...sorted];
  },
  { immediate: true, deep: true }
);

function onDragEnd(): void {
  const orderedIds = localBingos.value.map(b => b.id);
  bingoStore.reorderBingos(orderedIds);
}

function onDelete(id: number, event: Event): void {
  event.stopPropagation();

  // Check if it's the last bingo
  if (Object.keys(bingoStore.bingos).length <= 1) {
    alert('Impossible de supprimer le dernier bingo');
    return;
  }

  if (confirm('Supprimer ce bingo ?')) {
    emits('delete', id);
  }
}

function onBingoClick(id: number): void {
  if (props.syncToStore) {
    bingoStore.changeCurrentBingo(id);
    const prize = bingoStore.bingo.prizeId ? prizeStore.getPrize(bingoStore.bingo.prizeId) : null;
    syncBingo(bingoStore.bingo, { prize, lotoName: bingoStore.lotoName, lotoSubtitle: bingoStore.lotoSubtitle, lotoLogo: bingoStore.lotoLogo });
  }
  emits('choice', id);
}

// If selectedId is provided (even null), use it. Otherwise fall back to store's current bingo.
const activeId = computed(() => {
  if (props.selectedId !== undefined) {
    return props.selectedId;
  }
  return props.syncToStore ? bingoStore.currentBingoId : null;
});
</script>

<template>
  <div class="bingo-choice">
    <h3>{{ title }}</h3>
    <ul class="bingo-choice-wrapper">
      <draggable
        v-if="draggable"
        v-model="localBingos"
        item-key="id"
        tag="div"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <template #item="{ element: bingo }">
          <li>
            <div
              class="row-choice"
              :class="{
                active: bingo.id === activeId,
                finished: bingo.isFinished,
              }"
            >
              <span class="drag-handle">⠿</span>
              <p class="name">{{ bingo.settings.name }}</p>

              <div class="extras">
                <span class="type">{{ bingo.settings.type }}</span>
              </div>

              <button @click="onBingoClick(bingo.id)" class="choice-btn">
                <span class="btn-text">Choisir</span>
                <span class="btn-icon">→</span>
              </button>

              <button
                v-if="showDelete"
                @click="onDelete(bingo.id, $event)"
                class="delete-btn"
                aria-label="Supprimer ce bingo"
              >
                X
              </button>
            </div>
          </li>
        </template>
      </draggable>

      <template v-else>
        <li v-for="bingo in localBingos" :key="bingo.id">
          <div
            class="row-choice"
            :class="{
              active: bingo.id === activeId,
              finished: bingo.isFinished,
            }"
          >
            <p class="name">{{ bingo.settings.name }}</p>

            <div class="extras">
              <span class="type">{{ bingo.settings.type }}</span>
            </div>

            <button @click="onBingoClick(bingo.id)" class="choice-btn">
              <span class="btn-text">Choisir</span>
              <span class="btn-icon">→</span>
            </button>

            <button
              v-if="showDelete"
              @click="onDelete(bingo.id, $event)"
              class="delete-btn"
              aria-label="Supprimer ce bingo"
            >
              X
            </button>
          </div>
        </li>
      </template>

      <li v-if="showCreate">
        <div class="row-choice create-row" :class="{active: activeId == null}" @click="$emit('create')">
          <span class="create-icon">+</span>
          <p class="name">Nouveau bingo</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bingo-choice {
  min-width: 300px;
  width: 100%;
  container-type: inline-size;
}

h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.1rem;
}

.row-choice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.row-choice.finished {
  border-left-color: #10b981;
}

.name {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 auto;
  min-width: 120px;
}

.extras {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
}

.type {
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
  color: #f5576c;
  white-space: nowrap;
}

.choice-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);
}

.btn-icon {
  display: none;
}

.choice-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.choice-btn:active {
  transform: scale(0.97);
}

.delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.drag-handle {
  cursor: grab;
  color: #d1d5db;
  font-size: 1.2rem;
  padding: 0 0.25rem;
  user-select: none;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #9ca3af;
}

.drag-handle:active {
  cursor: grabbing;
}

.row-choice.active {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  border-color: rgba(240, 147, 251, 0.3);
}

.row-choice:not(.active):hover {
  background: white;
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bingo-choice-wrapper {
  display: block;
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.bingo-choice-wrapper::-webkit-scrollbar {
  width: 6px;
}

.bingo-choice-wrapper::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.bingo-choice-wrapper::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

@container (max-width: 450px) {
  .type,
  .extras {
    display: none;
  }
  .btn-text {
    display: none;
  }
  .btn-icon {
    display: inline;
  }
}

.create-row {
  border: 2px dashed #d1d5db;
  background-color: transparent;
  cursor: pointer;
  justify-content: center;
}

.create-row:hover {
  border-color: #f093fb;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%);
}

.create-icon {
  font-size: 1.5rem;
  font-weight: 300;
  color: #9ca3af;
  margin-right: 0.5rem;
  transition: color 0.2s;
}

.create-row:hover .create-icon {
  color: #f5576c;
}

.create-row .name {
  color: #6b7280;
  font-weight: 500;
}

.create-row:hover .name {
  color: #f5576c;
}
</style>
