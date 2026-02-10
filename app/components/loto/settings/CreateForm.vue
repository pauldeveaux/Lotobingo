<script setup lang="ts">
import type { BingoFormData } from "~/types/bingo";
import PrizeDropdownSelection from './PrizeDropdownSelection.vue';

const emits = defineEmits<{
  "bingo-created": [data: BingoFormData];
}>();

interface Props {
  bingoSettings?: BingoFormData | null;
  defaultTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bingoSettings: null,
  defaultTitle: "",
});

const defaultFormData = computed<BingoFormData>(() => ({
  name: props.defaultTitle,
  type: "Carton plein",
  maxNumber: 90,
  prizeIds: [],
}));

const form = reactive<BingoFormData>({ ...defaultFormData.value });

// Store initial values to detect changes
const initialValues = ref<BingoFormData | null>(null);

watch(
  () => props.bingoSettings,
  (newData) => {
    if (newData) {
      form.name = newData.name;
      form.type = newData.type;
      form.maxNumber = newData.maxNumber;
      form.prizeIds = [...newData.prizeIds];
      // Save initial state for dirty checking
      initialValues.value = { ...newData, prizeIds: [...newData.prizeIds] };
    } else {
      Object.assign(form, defaultFormData.value);
      initialValues.value = null;
    }
  },
  { immediate: true, deep: true },
);

// Check if form has been modified
const isDirty = computed(() => {
  if (!initialValues.value) return false; // Creation mode, no dirty state

  const initial = initialValues.value;
  if (form.name !== initial.name) return true;
  if (form.type !== initial.type) return true;
  if (form.maxNumber !== initial.maxNumber) return true;
  if (form.prizeIds.length !== initial.prizeIds.length) return true;
  if (!form.prizeIds.every(id => initial.prizeIds.includes(id))) return true;

  return false;
});

function createBingo(): void {
  emits("bingo-created", { ...form });
  Object.assign(form, defaultFormData.value);
}

const isBingoCreation = computed(() => props.bingoSettings == null);

function updateBingo() {
  emits("bingo-created", { ...form });
}

function onFormSubmit(): void {
  if (isBingoCreation.value) {
    createBingo();
  } else {
    updateBingo();
  }
}
</script>

<template>
  <ClientOnly>
    <form
      @submit.prevent="onFormSubmit"
      class="form"
      aria-label="Create new bingo game"
    >
      <!-- Bingo Name -->
      <div class="form-row">
        <label for="name">Nom :</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nom du bingo"
          v-model="form.name"
        />
      </div>

      <!-- Bingo Type -->
      <div class="form-row">
        <label for="type">Type :</label>
        <select id="type" name="type" v-model="form.type">
          <option value="Carton plein">Carton plein</option>
          <option value="Quine">Quine</option>
          <option value="Double quine">Double Quine</option>
        </select>
      </div>

      <!-- Balls Number -->
      <div class="form-row">
        <label for="ballsNumber">Nombre de boules :</label>
        <select
          id="ballsNumber"
          name="ballsNumber"
          v-model="form.maxNumber"
        >
          <option value="75">75 boules</option>
          <option value="90" selected>90 boules</option>
        </select>
      </div>

      <!-- Prizes Selection -->
      <div class="form-row">
          <label>Lots :</label>
        <PrizeDropdownSelection v-model="form.prizeIds" />
      </div>


      <!-- Create Button -->
      <div class="form-row form-row-right">
        <span v-if="isDirty" class="dirty-indicator">Modifications non sauvegardées</span>
        <button
          type="submit"
          class="submit-btn"
          :class="{ 'has-changes': isDirty }"
          :disabled="!form.name"
        >
          {{ isBingoCreation ? "Créer" : "Modifier" }}
        </button>
      </div>
    </form>
  </ClientOnly>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 500px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

label {
  width: 150px;
  font-weight: 600;
  text-align: right;
  color: #374151;
}

input,
select,
textarea {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  background: #f9fafb;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
  outline: none;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.form-row-right {
  justify-content: end;
  margin-top: 0.5rem;
}

.submit-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.dirty-indicator {
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dirty-indicator::before {
  content: "●";
  font-size: 0.6rem;
}

.submit-btn.has-changes {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  animation: pulse 2s infinite;
}

.submit-btn.has-changes:hover {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.6);
  }
}
</style>
