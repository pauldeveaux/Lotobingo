<script setup>
import BingoGrid from '~/components/loto/bingo-grid.vue';
const { connect, bingoState, isConnected } = useWebSocket();  

onMounted(
    () => connect()

);

const balls = computed(() => {
    if (!bingoState.value) return [];
    const { minNumber, maxNumber } = bingoState.value.settings;
    return Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber); 
});
</script>

<template>
    <div v-if="!isConnected" class="status"><h1>Connexion en cours...</h1></div>
    <div v-else-if="!bingoState" class="status"><h1>En attente des données...</h1></div>
    <template v-else>
        <h1>{{ bingoState.settings.name }}</h1>
        <div class="client-view" >
            <BingoGrid 
                :numbers="balls"
                :drawn-numbers="bingoState.drawnNumbers"
                :cell-size-screen-percentage="80"
                :ball-config="{
                    hoverable: false,
                    clickable: false
                }"
            />
        </div>
    </template>
    
</template>

<style scoped>


</style>