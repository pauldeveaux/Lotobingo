<script setup lang="ts">
interface Props {
    message?: string
}

defineProps<Props>()
</script>

<template>
    <div v-if="message" class="error-message">{{ message }}</div>
</template>

<style scoped>
.error-message {
    color: #f44336;
    font-weight: bold;
    margin-top: 1rem;
    text-align: center;
}
</style>
