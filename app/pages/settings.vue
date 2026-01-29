<script setup>
import BingoCreateForm from '~/components/settings/bingo-create-form.vue';

const bingoStore = useBingoStore();
    
function createBingo(bingoSettings){
  bingoStore.createBingo(bingoSettings)
}
</script>

<template>
    <h1>Paramètres</h1>
    <h2>Bingo</h2>

    <!-- Nav TODO -->


    <BingoCreateForm @bingo-created="createBingo($event)"/>


    <!-- Bingo List -->
    <div id="bingo-list">
      <ul>
        <li @click="bingoStore.changeCurrentBingo(bingo.id)" v-for="bingo in bingoStore.bingos">
            {{ bingo.settings.name }} - {{ bingo.settings.type }}
        </li>
      </ul>

    </div>
</template>

<style scoped>

</style>