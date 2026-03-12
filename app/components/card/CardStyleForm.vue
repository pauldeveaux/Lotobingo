<script setup>
const colors = defineModel({
  type: Object,
  required: true,
  default: () => ({
    background: "#ffffff",
    number: "#000000",
    title: "#000000",
    numberBox: "#e2e8f0",
    emptyBox: "#ffffff",
  }),
});
</script>

<template>
  <div class="color-choice-grid">
    <div class="input-group">
      <label for="bg-color">Fond de la carte</label>
      <div class="input-wrapper">
        <input type="color" id="bg-color" v-model="colors.background" />
        <span class="color-value">{{ colors.background }}</span>
      </div>
    </div>

    <div class="input-group">
      <label for="num-color">Couleur des chiffres</label>
      <div class="input-wrapper">
        <input type="color" id="num-color" v-model="colors.number" />
        <span class="color-value">{{ colors.number }}</span>
      </div>
    </div>

    <div class="input-group">
      <label for="title-color">Couleur du titre</label>
      <div class="input-wrapper">
        <input type="color" id="title-color" v-model="colors.title" />
        <span class="color-value">{{ colors.title }}</span>
      </div>
    </div>

    <div class="input-group">
      <label for="box-color">Fond case numérotée</label>
      <div class="input-wrapper">
        <input type="color" id="box-color" v-model="colors.numberBox" />
        <span class="color-value">{{ colors.numberBox }}</span>
      </div>
    </div>

    <div class="input-group">
      <label for="empty-box-color">Fond case vide</label>
      <div class="input-wrapper">
        <input
          type="color"
          id="empty-box-color"
          v-model="colors.emptyBox"
        />
        <span class="color-value">{{ colors.emptyBox }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-choice-grid {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 5px;
  padding: 4px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

input[type="color"] {
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: none;
  padding: 0;
}

.color-value {
  font-family: monospace;
  font-size: 0.8rem;
  color: #475569;
}
</style>
