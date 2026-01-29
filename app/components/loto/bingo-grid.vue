<script setup>
import Ball from '~/components/loto/ball.vue';

const props = defineProps({
    numbers: Array,
    ballConfig: Object,
    drawnNumbers: Array,
    cellSizeScreenPercentage: Number
})

const emits = defineEmits([
    "draw-number"
])


const columns = computed(() => Math.ceil(Math.sqrt(props.numbers.length)));
console.log(columns.value)
</script>

<template>
    <div 
        id="bingo-grid"
        :style="{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            height: `${cellSizeScreenPercentage}vh`,
            width: `${cellSizeScreenPercentage}vh`
      }"
    >
        <ClientOnly>
<div v-for="number in numbers" :key="number" class="ball-wrapper">
    <Ball 
        :number="number" 
        :config="ballConfig"
        :drawn="drawnNumbers.includes(number)"
        @click="emits('draw-number', number)"
    />
</div>
        </ClientOnly>
    </div>
</template>

<style scoped>
#bingo-grid {
    display: grid;
    gap: 6px;
    justify-self: center;
}
.ball-wrapper {
    width: 100%;
    aspect-ratio: 1/1; /* cellule carrée */
}
</style>