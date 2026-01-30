<script setup lang="ts">
/**
 * Component for selecting and switching between bingo games.
 * Syncs the selected game to connected clients.
 */
const bingoStore = useBingoStore()
const { syncBingo } = useWebSocket()

function changeCurrentBingo(id: number): void {
  bingoStore.changeCurrentBingo(id)
  syncBingo(bingoStore.bingo)
}
</script>

<template>
  <div class="bingo-choice">
    <h3>Choix du jeu</h3>
    <ul class="bingo-choice-wrapper">
      <li v-for="bingo in bingoStore.bingos" :key="bingo.id">
        <div
          class="row-choice"
          :class="{
            active: bingo.id === bingoStore.currentBingoId,
            finished: bingo.isFinished,
          }"
        >
          <p class="name">{{ bingo.settings.name }}</p>

          <div class="extras">
            <span class="type">{{ bingo.settings.type }}</span>
            <p class="lot">Lot 1</p>
          </div>

          <button @click="changeCurrentBingo(bingo.id)" class="choice-btn">
            <span class="btn-text">Choisir</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bingo-choice {
  min-width: 30%;
  width: 70%;
}

.row-choice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background-color: #f7f7f7;
  transition: background-color 0.2s ease;
  border-left: 4px solid transparent;
}

/* Finished indicator - green left border */
.row-choice.finished {
  border-left-color: #22c55e;
}

/* Nom du jeu - priorité maximale */
.name {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 50px;
}

.extras {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  overflow: hidden;
}

/* Badge type */
.type {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 999px;
  background-color: #e5e7eb;
  color: #374151;
  white-space: nowrap;
}

/* Lot */
.lot {
  margin: 0;
  font-size: 0.9rem;
  color: #4b5563;
  white-space: nowrap;
}

/* Bouton */
.choice-btn {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  flex-shrink: 0;
}

.btn-icon {
  display: none;
}

.choice-btn:hover {
  background-color: #2563eb;
}

.choice-btn:active {
  transform: scale(0.97);
}

/* Active */
.row-choice.active {
  background-color: #dbeafe;
  box-shadow: inset 0 0 0 1px #3b82f6;
}

/* Hover */
.row-choice:not(.active):hover {
  background-color: #eaeaea;
}

/* Liste */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bingo-choice-wrapper {
  display: block;
  max-height: 40vh;
  overflow-y: auto;
}

/* Responsive - hide extras progressively */
@media (max-width: 1100px) {
  .lot {
    display: none;
  }
}

@media (max-width: 950px) {
  .type {
    display: none;
  }
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
</style>
