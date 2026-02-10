<script setup lang="ts">
import { useBingoStore } from "~/stores/useBingoStore";
import ValidateButton from "~/components/ui/ValidateButton.vue";

const bingoStore = useBingoStore();
const emits = defineEmits<{
  "add-number": [number: number];
}>();

const number = ref<number | null>(null);
const lastNumber = defineModel("lastNumber", { required: true });

function generateRandom(): void {
  const randomNumber =
    bingoStore.remainingNumbers[
      Math.floor(Math.random() * bingoStore.remainingNumbers.length)
    ];
  if (randomNumber == null) return;
  number.value = null;
  emits("add-number", randomNumber);
}

function addNumber(): void {
  if (number.value !== null) {
    emits("add-number", number.value);
  }
  console.log(number.value);
  number.value = null;
}
</script>

<template>
  <div id="add-number-form">
    <form @submit.prevent="addNumber" class="number-form">
      <!-- Top part -->
      <div class="form-row">
        <label for="number" class="form-label">Numéro :</label>
        <div class="input-group">
          <input
            v-model="number"
            id="number"
            name="number"
            type="number"
            min="1"
            :max="bingoStore.bingo.settings.maxNumber"
            aria-describedby="number-hint"
          />
          <div>
            <ValidateButton
              class="validate-btn"
              :disabled="!number || bingoStore.isDrawn(Number(number))"
            />
          </div>
        </div>
        <span id="number-hint" class="visually-hidden"
          >Enter a number between 1 and
          {{ bingoStore.bingo.settings.maxNumber }}</span
        >
      </div>

      <!-- Bottom part -->
      <div>
        <button
          @click="generateRandom"
          type="button"
          class="btn-random"
          aria-label="Generate random number"
        >
          Tirer un nombre aléatoire
        </button>

        <div class="random-result">
          <span class="result-label">Tirage :</span>
          <div class="ball-wrapper" :class="{ 'no-ball': !lastNumber }">

          <Transition name="pop">
            <span v-if="lastNumber" class="result-value" :key="lastNumber">
              {{ lastNumber }}
            </span>
          </Transition>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
#add-number-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  margin: 1rem auto;
}

.number-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #374151;
}

.input-group {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

input[type="number"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background: #f9fafb;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

input[type="number"]:focus {
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

.btn-random {
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-random:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

.validate-btn {
  justify-self: end;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.random-result {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.ball-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-ball {
  border-radius: 50%;
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db; 
  color: #9ca3af; 
}
.no-ball::after {
  content: "?";
  font-weight: bold;
  font-size: 1.2rem;
}

.result-label {
  font-size: 0.85rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.result-value {
  position: absolute;
  top: 0;
  left: 0;
  z-index:10;

  font-size: 1.2rem;
  font-weight: 800;
  color: #f5576c;
  line-height: 1;

  background: #fff0f3;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #f093fb;
  box-shadow: 0 4px 10px rgba(240, 147, 251, 0.3);
}

/* Animation d'entrée */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.pop-leave-to {
  opacity: 0;
  transform: scale(1.5); 
}
</style>
