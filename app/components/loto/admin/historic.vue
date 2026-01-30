<script setup lang="ts">
/**
 * Displays the history of drawn numbers with ability to cancel/undo.
 * List is displayed in reverse order (most recent at top).
 */
import { useBingoStore } from '~/stores/useBingoStore'

const bingoStore = useBingoStore()
const { syncBingo } = useWebSocket()

/** Removes a number from the draw history and syncs to clients */
function cancelNumber(number: number): void {
    bingoStore.cancelDraw(number)
    syncBingo(bingoStore.bingo)
}
</script>

<template>
    <div class="overflow-wrapper">
        <h3>Historique</h3>
        <TransitionGroup tag="ul" name="historic-row">
            <li  v-for="number in bingoStore.drawnNumbers" :key="number" class="historic-row">
                    <p>{{ number }}</p>
                    <button @click="cancelNumber(number)" class="delete">X</button>
            </li>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.overflow-wrapper {
    max-height: 40vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
}


ul {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
}

h3 {
    align-items: flex-end;
    text-align: end;
    margin-right: 20px;
}

.historic-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    width: 100px;
    padding: 0.3rem 0.5rem;

    background: #f6f6f6;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);

    transition: background 0.2s ease, transform 0.1s ease;
}


/* Historic Animation */
.historic-row-enter-active,
.historic-row-leave-active,
.historic-row-move {
  transition: all 0.5s ease;
}
.historic-row-enter-from,
.historic-row-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.historic-row-leave-active {
  position: absolute;
}

/* Hover léger */
.historic-row:hover {
    background: #eeeeee;
    transform: translateY(-1px);
}

/* Numéro */
.historic-row p {
    margin: 0;
    font-weight: 600;
    font-size: 1.2rem;
}

.historic-row:last-child {
    background-color: #d9f0ff;
}

/* Bouton delete */
.delete {
    border: none;
    background: transparent;
    cursor: pointer;

    font-size: 0.85rem;
    font-weight: bold;
    color: #999;

    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    flex-shrink: 0;

    transition: color 0.2s ease, background 0.2s ease;
}

.delete:hover {
    color: #c0392b;
    background: rgba(192, 57, 43, 0.1);
}

@media (max-width: 900px) {
    .historic-row {
        padding: 0.3rem 0.5rem;
    }
    .historic-row p {
        font-size: 1rem;
    }
    .delete {
        font-size: 0.75rem;
        padding: 0.15rem 0.3rem;
    }
}

@media (max-width: 700px) {
    .historic-row {
        padding: 0.25rem 0.4rem;
    }
    .historic-row p {
        font-size: 0.9rem;
    }
}
</style>