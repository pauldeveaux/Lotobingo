<script setup lang="ts">
</script>

<template>
  <nav class="nav-container">
    <slot></slot>
  </nav>
</template>

<style scoped>
.nav-container {
  position: fixed;
  left: 0;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 160px;
  padding: 1.25rem 1rem;
  background: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 60px);
  z-index: 10;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.03);
}

.nav-container :slotted(*) {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-container :slotted(*:hover) {
  background: #f9fafb;
  color: #374151;
  border-color: #e5e7eb;
}

.nav-container :slotted(.router-link-active) {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  color: #f5576c;
  border-color: rgba(240, 147, 251, 0.3);
}
</style>