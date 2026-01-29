<script setup>
    defineProps({
        label: String
    })

    const showDetails = ref(false);

    function toggleDetails() {
        showDetails.value = !showDetails.value;
    }
</script>

<template>
        <button type="button" @click="toggleDetails" class="toggle-btn">
            {{ label }} {{ showDetails ? '▲' : '▼' }}
        </button>
        <div v-if="showDetails" class="content">
            <slot></slot>
        </div>
</template>

<style scoped>
.toggle-btn {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  padding: 6px 12px;
}

.toggle-btn:hover {
  background-color: #e0e0e0;
}
</style>