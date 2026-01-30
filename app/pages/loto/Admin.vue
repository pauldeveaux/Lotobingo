<script setup lang="ts">
/**
 * Admin page for managing bingo draws.
 * Handles number drawing, game state, and WebSocket sync with clients.
 */
import ErrorMessage from "~/components/ui/ErrorMessage.vue"
import AddNumber from "~/components/loto/admin/AddNumber.vue"
import BingoGrid from "~/components/loto/BingoGrid.vue"
import Historic from "~/components/loto/admin/Historic.vue"
import BingoChoice from "~/components/loto/admin/BingoChoice.vue"

const bingoStore = useBingoStore()
const { connect, syncBingo, onRequestSync, isConnected } = useWebSocket()

// Initialize WebSocket and set up sync handler for new clients
onMounted(
  () => {
    connect()
    onRequestSync(() => {
      syncBingo(bingoStore.bingo)
    })
  }
)

// Sync state whenever connection is restored
watch(isConnected, (connected: boolean) => {
  if (connected) {
    syncBingo(bingoStore.bingo)
  }
})

const errorMessage = ref<string>("")

/** Draws a number and broadcasts to connected clients */
function drawNumber(number: number): void {
  try {
    bingoStore.drawNumber(number)
    syncBingo(bingoStore.bingo)
    errorMessage.value = ""
  } catch (err) {
    errorMessage.value = (err as Error).message
  }
}

function toggleFinished(): void {
  bingoStore.toggleFinishCurrent()
}

function resetBingo(): void {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser le tirage ?")) {
    bingoStore.resetCurrent()
    syncBingo(bingoStore.bingo)
  }
}
</script>

<template>
  <h1>{{ bingoStore.bingo.settings.name }}</h1>
  <div id="loto-view">

    <Historic id="historic"></Historic>

    <BingoGrid
      id="bingo-grid"
      @draw-number="drawNumber($event)"
      :numbers="bingoStore.balls"
      :drawn-numbers="bingoStore.drawnNumbers"
      max-height="60vh"
    />

    <ErrorMessage :message="errorMessage" />

    <BingoChoice id="bingo-choice" />
    <AddNumber id="add-number-form" @add-number="drawNumber($event)" />

    <div id="action-buttons">
      <button id="reset-btn" @click="resetBingo">
        Réinitialiser le tirage
      </button>
      <button
        @click="toggleFinished"
        id="finish-btn"
        :class="{ finished: bingoStore.isFinished }"
      >
        {{ bingoStore.bingo.isFinished ? "Reprendre le tirage" : "Finaliser le tirage" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#loto-view {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto auto;
  gap: 1.5rem;
  padding: 1rem;
  margin: 0 1rem;
  width: calc(100% - 2rem);
  overflow-x: hidden;
}

#historic {
  grid-column: 1;
  grid-row: 1 / span 2;
  justify-self: end;
  justify-content: end;
}

#add-number-form {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
}

#bingo-grid {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
}

#bingo-choice {
  grid-column: 3;
  justify-self: start;
}

#action-buttons {
    grid-row: 3;
    grid-column: 2;
    justify-self: center;
    display: flex;
    gap: 1rem;
}

#finish-btn, #reset-btn {
    padding: 0.35rem 0.7rem;
    min-width: 100px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    color: white;
}

#finish-btn {
    background-color: #f97316;
}

#finish-btn.finished {
    background-color: #22c55e;
}

#reset-btn {
    background-color: #ef4444;
}

#finish-btn:hover, #reset-btn:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
}

#finish-btn:active, #reset-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

</style>
