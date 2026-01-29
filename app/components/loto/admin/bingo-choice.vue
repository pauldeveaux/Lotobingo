<script setup>
const bingoStore = useBingoStore();
const { syncBingo } = useWebSocket();


function changeCurrentBingo(id) {
  bingoStore.changeCurrentBingo(id);
  syncBingo(bingoStore.bingo);
}
</script>

<template>
  <div>
    <h3>Choix du jeu</h3>
    <ul class="bingo-choice-wrapper">
      <li v-for="bingo in bingoStore.bingos" :key="bingo.id">
        <div
          class="row-choice"
          :class="{ active: bingo.id === bingoStore.currentBingoId }"
        >
          <!-- Conteneur de la coche à gauche -->
          <span class="finished-icon-container">
            <span v-if="bingo.finished" class="finished-icon">✓</span>
          </span>

          <div class="info">
            <p class="name">{{ bingo.settings.name }}</p>
            <span class="type">{{ bingo.settings.type }}</span>
          </div>

          <p class="lot">Lot 1</p>

          <button @click="changeCurrentBingo(bingo.id)" class="choice-btn">
            Choisir
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.row-choice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    background-color: #f7f7f7;
    transition: background-color 0.2s ease;
}

/* Conteneur de la coche fixe à gauche */
.finished-icon-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem; /* espace fixe */
    min-width: 1.5rem; /* garantit que le layout ne bouge jamais */
    margin-right: 0.5rem; /* petit espace avant le nom */
}

/* Symbole ✓ */
.finished-icon {
    font-size: 1.2rem;
    color: #22c55e; /* vert doux */
    font-weight: bold;
}

/* Info (nom + type) */
.info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* Nom du jeu */
.name {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
}

/* Badge type */
.type {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 999px;
    background-color: #e5e7eb;
    color: #374151;
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
    padding: 0.4rem 0.9rem;
    border: none;
    border-radius: 6px;
    background-color: #3b82f6;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
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
    border: 1px solid #3b82f6;
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
    height: 40vh;
    overflow-y: auto;
}

</style>
