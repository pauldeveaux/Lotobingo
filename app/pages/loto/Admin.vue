<script setup>
import ErrorMessage from "~/components/errors/error-message.vue";
import AddNumber from "~/components/loto/admin/add-number.vue";
import BingoGrid from "~/components/loto/bingo-grid.vue";
import Historic from "~/components/loto/admin/historic.vue";
import BingoChoice from "~/components/loto/admin/bingo-choice.vue";

const bingoStore = useBingoStore();
const { connect, syncBingo, onRequestSync, isConnected } = useWebSocket();

onMounted(
  () => {
    connect();
    onRequestSync(() => {
      syncBingo(bingoStore.bingo);
    })
  }
)

watch(isConnected, (connected) => {
  if (connected) {
    syncBingo(bingoStore.bingo);
  }
})

const errorMessage = ref("");

function drawNumber(number) {
  try {
    bingoStore.drawNumber(number);
    syncBingo(bingoStore.bingo);                                                                                                                                                                     
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = err.message;
  }
}

function toggleFinished() {
  bingoStore.toggleFinishCurrent();
}
</script>

<template>
  <h1>{{ bingoStore.bingo.settings.name }}</h1>
  <div id="loto-view">
    <Historic id="historic"></Historic>

    <BingoGrid
      @draw-number="drawNumber($event)"
      :numbers="bingoStore.balls"
      :drawn-numbers="bingoStore.drawnNumbers"
      :cell-size-screen-percentage="50"
    />

    <ErrorMessage :message="errorMessage" />

    <BingoChoice id="bingo-choice" />
    <AddNumber id="add-number-form" @add-number="drawNumber($event)" />

    <button
      @click="toggleFinished"
      id="finish-btn"
      :class="{ finished: bingoStore.isFinished }"
    >
      {{ bingoStore.bingo.isFinished ? "Reprendre le tirage" : "Finaliser le tirage" }}
    </button>
  </div>
</template>

<style scoped>
#loto-view {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: auto 1fr auto auto;
  gap: 1.5rem;
  padding: 1rem;
  width: 100%;
}

#historic {
  grid-column: 1;
  grid-row: 1 / span 2;
  justify-self: center;
}

#add-number-form {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
}

#bingo-choice {
  grid-column: 3;
  justify-self: center;
}

#finish-btn {
    grid-row: 3;
    grid-column: 2;
    justify-self: center;
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
    background-color: #f97316;
}

#finish-btn.finished {
    background-color: #22c55e; /* vert Reprendre */
}

/* Hover effect : léger et pas de scale qui fait bouger la grid */
#finish-btn:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px); /* juste un petit lift */
}

/* Active effect : clic subtil */
#finish-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

</style>
