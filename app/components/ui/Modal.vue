<script setup></script>

<template>
  <Teleport to="body">
    <div class="modal-mask">
      <div class="modal-container">
        <slot name="all-content">
          <slot name="title"></slot>

          <slot></slot>

          <div class="ok-button-container">
            <slot name="ok-button">
              <button>OK</button>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 90%;
  max-width: 500px;
  min-width: 280px;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4x 20px rgba(0, 0, 0, 0.25);
  animation: modal-in 0.2s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.ok-button-container {
  width: 100%;
  display: flex;
  justify-content: end;
}

.ok-button-container button {
  padding: 8px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.ok-button-container button:hover {
  background-color: #2563eb;
}
</style>
