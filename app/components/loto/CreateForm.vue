<script setup lang="ts">
import AdvancedField from '~/components/ui/AdvancedField.vue'
import type { BingoFormData } from '~/types/bingo'

const emits = defineEmits<{
    'bingo-created': [data: BingoFormData]
}>()

const form = reactive<BingoFormData>({
    name: '',
    type: 'Carton plein',
    ballsNumber: 90,
})

function createBingo(): void {
    emits('bingo-created', { ...form })
    form.name = ""
}
</script>

<template>
    <!-- Bingo -->
    <form @submit.prevent="createBingo" class="form">
        <div class="form-row">
            <label for="name">Nom :</label>
            <input type="text" name="name" placeholder="Nom du bingo" v-model="form.name">
        </div>

        <div class="form-row">
            <label for="type">Type :</label>
            <select id="type" name="type" v-model="form.type">
                <option value="Carton plein">Carton plein</option>
                <option value="Quine">Quine</option>
                <option value="Double quine">Double Quine</option>
            </select>
        </div>

        <div class="form-row">
            <label for="ballsNumber">Nombre de boules :</label>
            <input type="number" name="ballsNumber" min="50" max="100" v-model="form.ballsNumber">
        </div>
        <div class="form-row">
          <label for="toggle">Ajouter lot(s) : </label>
          <AdvancedField>
            <!--TODO-->
            <input type="text">
          </AdvancedField>
        </div>
        <div class="form-row form-row-right">
            <button type="submit" class="submit-btn">Créer</button>
        </div>
    </form>
</template>

<style scoped>
    .form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 700px;
  font-family: Arial, sans-serif;
}

/* Chaque row horizontal */
.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

label {
  width: 150px; /* largeur fixe pour aligner */
  font-weight: bold;
  text-align: right;
}

input, select, textarea {
  flex: 1; /* occupe tout l'espace restant */
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
  outline: none;
}

/* Boutons */
button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.form-row-right {
    justify-content: end;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  font-size: 1rem;
}

.submit-btn:hover {
  background-color: #357ABD;
}
</style>