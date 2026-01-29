<script setup>
import { useBingoStore } from '~/stores/useBingoStore';
import ValidateButton from '~/components/buttons/validate-button.vue';
    const bingoStore = useBingoStore();
    const emits = defineEmits(["add-number"]);


    const number = ref(null);
    

    function generateRandom() {
        number.value = bingoStore.remainingNumbers[Math.floor(Math.random() * bingoStore.remainingNumbers.length)];
    }

    function addNumber() {
        emits('add-number', number.value)
        number.value = "";
    }
</script>

<template>
    <div id="add-number-form">
        <form @submit.prevent="addNumber" class="number-form">
            <!-- Top part -->
            <div class="form-row">
                <label for="number" class="form-label">Numéro :</label>
                <div class="input-group">
                    <input v-model="number" name="number" type="number" min="1" :max="bingoStore.bingo.settings.maxNumber">
                    <button @click="generateRandom" type="button" class="btn-random">Nombre aléatoire</button>
                </div>
            </div>
            
            <!-- Bottom part -->
            <div>
                <ValidateButton class="validate-btn" :disabled="!number || bingoStore.isDrawn(Number(number))"/>
            </div>
        </form>
    </div>
</template>

<style scoped>
#add-number-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; /* centrer le formulaire */
    border: 1px solid #333;
    border-radius: 10px;
    padding: 1rem;
    background-color: #fafafa;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    max-width: 350px;
    margin: 1rem auto;
}

.number-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    color: #333;
}

.input-group {
    display: flex;
    flex-direction: row; /* input + bouton sur la même ligne */
    gap: 0.5rem;
}

input[type="number"] {
    flex: 1;
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s ease;
}

input[type="number"]:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.btn-random {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
    border-radius: 6px; 
    border: 1px solid #3498db; 
    background-color: #3498db;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.btn-random:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
}

.validate-btn {
    justify-self: end;
}
</style>