<script setup lang="ts">
import Card from '~/components/card/Card.vue'
import { checkCardWin, getMatchedNumbers } from '~/utils/cardVerification'

const cardStore = useCardStore()
const bingoStore = useBingoStore()

const cardIdInput = ref<number | null>(null)
const error = ref('')
const verified = ref(false)

const foundCard = computed(() => {
  if (cardIdInput.value === null) return null
  return cardStore.getCard(cardIdInput.value)
})

const result = computed(() => {
  if (!foundCard.value) return null
  return checkCardWin(
    foundCard.value,
    bingoStore.drawnNumbers,
    bingoStore.bingo.settings.type
  )
})

const matchedNumbers = computed(() => {
  if (!foundCard.value) return new Set<number>()
  return getMatchedNumbers(foundCard.value, bingoStore.drawnNumbers)
})

function verify() {
  error.value = ''
  verified.value = false

  if (cardIdInput.value === null || cardIdInput.value <= 0) {
    error.value = 'Veuillez entrer un numéro de carton valide.'
    return
  }

  if (!foundCard.value) {
    error.value = `Carton #${cardIdInput.value} introuvable.`
    return
  }

  verified.value = true
}

function reset() {
  cardIdInput.value = null
  error.value = ''
  verified.value = false
}
</script>

<template>
  <div class="card-verificator">
    <h3>Vérification de carton</h3>

    <form class="verify-form" @submit.prevent="verify">
      <input
        v-model.number="cardIdInput"
        type="number"
        min="1"
        placeholder="N° du carton"
        class="card-id-input"
      />
      <button type="submit" class="verify-btn">Vérifier</button>
    </form>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <div v-if="verified && foundCard && result" class="result">
      <div class="result-badge" :class="result.won ? 'won' : 'lost'">
        {{ result.won ? 'GAGNÉ' : 'PERDU' }}
      </div>
      <p class="result-detail">
        {{ result.completedLines }} ligne{{ result.completedLines > 1 ? 's' : '' }} complétée{{ result.completedLines > 1 ? 's' : '' }}
      </p>

      <div class="card-preview">
        <Card
          :card="foundCard"
          :highlighted-numbers="matchedNumbers"
          :show-delete="false"
        />
      </div>

      <button class="reset-btn" @click="reset">Nouveau</button>
    </div>
  </div>
</template>

<style scoped>
.card-verificator {
  padding: 0.5rem;
}

.card-verificator h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #1f2937;
}

.verify-form {
  display: flex;
  gap: 0.4rem;
}

.card-id-input {
  flex: 1;
  padding: 0.4rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  min-width: 0;
}

.card-id-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.verify-btn {
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.verify-btn:hover {
  opacity: 0.9;
}

.error-msg {
  margin: 0.4rem 0 0 0;
  color: #ef4444;
  font-size: 0.8rem;
}

.result {
  margin-top: 0.5rem;
}

.result-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.result-badge.won {
  background: #d1fae5;
  color: #065f46;
}

.result-badge.lost {
  background: #fee2e2;
  color: #991b1b;
}

.result-detail {
  margin: 0.3rem 0 0.5rem 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.card-preview {
  display: flex;
  justify-content: center;
}

.reset-btn {
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.reset-btn:hover {
  background: rgba(107, 114, 128, 0.15);
}
</style>
