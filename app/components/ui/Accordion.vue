<script setup lang="ts">
interface Props {
  label: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="accordion" :class="{ open: isOpen }">
    <button type="button" class="accordion-header" @click="toggle">
      <span class="accordion-label">{{ label }}</span>
      <span class="accordion-icon">{{ isOpen ? '−' : '+' }}</span>
    </button>
    <div class="accordion-content" v-show="isOpen">
      <div class="accordion-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: #f3f4f6;
}

.accordion.open .accordion-header {
  background: #e8f4fc;
  color: #3498db;
}

.accordion-icon {
  font-size: 1.25rem;
  font-weight: 300;
  color: #9ca3af;
  transition: transform 0.2s;
}

.accordion.open .accordion-icon {
  color: #3498db;
}

.accordion-content {
  border-top: 1px solid #e5e7eb;
}

.accordion-body {
  padding: 1rem;
  background: #fff;
}
</style>
