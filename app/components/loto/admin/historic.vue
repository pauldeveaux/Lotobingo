<script setup lang="ts">
/**
 * Displays the history of drawn numbers with ability to cancel/undo.
 * List is displayed in reverse order (most recent at top).
 */
import { useBingoStore } from '~/stores/useBingoStore'

const bingoStore = useBingoStore()
const emit = defineEmits<{
    'cancel': [number:number]
}>();

const reversedNumbers = computed(() => [...bingoStore.drawnNumbers].reverse())

</script>

<template>
    <div class="historic-container" role="region" aria-labelledby="historic-title">
        <h3 id="historic-title">Historique</h3>
        <div class="overflow-wrapper">
            <TransitionGroup tag="ul" name="historic-row" aria-label="Drawn numbers history" :key="bingoStore.currentBingoId">
                <li v-for="number in reversedNumbers" :key="number" class="historic-row">
                        <p>{{ number }}</p>
                        <button @click="emit('cancel',number)" class="delete" :aria-label="`Remove number ${number}`">X</button>
                </li>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped>
.historic-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

h3 {
    text-align: start;
    margin: 0;
    padding: 1rem 1rem 0.75rem;
    color: #1f2937;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.overflow-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 1rem 1rem;
    min-height: 0;
}

.overflow-wrapper::-webkit-scrollbar {
    width: 6px;
}

.overflow-wrapper::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
}

.overflow-wrapper::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

ul {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
    width: 100%; 
}

.historic-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    width: 110px;
    padding: 0.5rem 0.75rem;

    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;

    transition: all 0.2s ease;
}

/* Historic Animation */
.historic-row-enter-active,
.historic-row-leave-active,
.historic-row-move {
  transition: all 0.4s ease;
}
.historic-row-enter-from,
.historic-row-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.historic-row-leave-active {
  position: absolute;
}

.historic-row:hover {
    background: white;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.historic-row p {
    margin: 0;
    font-weight: 700;
    font-size: 1.2rem;
    color: #1f2937;
}

.historic-row:first-child {
    background: linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
    border-color: rgba(240, 147, 251, 0.3);
}

.historic-row:first-child p {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.delete {
    border: none;
    background: transparent;
    cursor: pointer;

    font-size: 0.85rem;
    font-weight: bold;
    color: #9ca3af;

    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    flex-shrink: 0;

    transition: color 0.2s ease, background 0.2s ease;
}

.delete:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 900px) {
    .historic-row {
        padding: 0.4rem 0.6rem;
        width: 100px;
    }
    .historic-row p {
        font-size: 1rem;
    }
}
</style>