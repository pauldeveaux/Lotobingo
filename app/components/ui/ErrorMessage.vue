<script setup lang="ts">
import Modal from "./Modal.vue";

interface Props {
  message?: string;
}

defineProps<Props>();

const emit = defineEmits<{ dismiss: [] }>();
</script>

<template>
  <Modal v-if="message">
    <template #title>
      <div class="error-title">
        <span class="error-icon">⚠</span>
        Error
      </div>
    </template>

    <div class="error-message">{{ message }}</div>

    <template #ok-button>
      <button class="dismiss-btn" @click="emit('dismiss')">OK</button>
    </template>
  </Modal>
</template>

<style scoped>
.error-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #dc2626;
}
.error-icon {
  font-size: 1.4rem;
}
.error-message {
  color: #374151;
  margin: 16px 0;
  text-align: center;
  line-height: 1.5;
}
.dismiss-btn {
  padding: 8px 24px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.dismiss-btn:hover {
  background-color: #b91c1c;
}
</style>
