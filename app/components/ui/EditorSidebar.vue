<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
defineExpose({ close: () => { isOpen.value = false } })
</script>

<template>
  <button class="editor-sidebar-toggle" :class="{ open: isOpen }" @click="isOpen = !isOpen" aria-label="Toggle sidebar">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <div class="editor-sidebar-overlay" v-if="isOpen" @click="isOpen = false" />
  <div class="settings-editor-sidebar" :class="{ open: isOpen }">
    <slot></slot>
  </div>
</template>

<style scoped>
.editor-sidebar-toggle {
  display: none;
}

@media (max-width: 1050px) {
  .editor-sidebar-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: none;
    border-radius: 50%;
    padding: 12px;
    cursor: pointer;
    z-index: 200;
    box-shadow: 0 4px 16px rgba(245, 87, 108, 0.4);
  }

  .editor-sidebar-toggle span {
    display: block;
    width: 100%;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.2s;
    transform-origin: center;
  }

  .editor-sidebar-toggle.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .editor-sidebar-toggle.open span:nth-child(2) {
    opacity: 0;
  }

  .editor-sidebar-toggle.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .editor-sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .settings-editor-sidebar {
    position: fixed !important;
    top: 60px !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 340px !important;
    grid-column: unset !important;
    grid-row: unset !important;
    border-radius: 16px 0 0 16px !important;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.25s ease;
    z-index: 100;
  }

  .settings-editor-sidebar.open {
    transform: translateX(0);
  }
}
</style>
