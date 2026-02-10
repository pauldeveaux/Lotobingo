<script setup lang="ts">
</script>

<template>
  <div class="cards-layout">
    <UiNav>
      <NuxtLink to="/cards/generate">Générer</NuxtLink>
      <NuxtLink to="/cards/view">Mes cartons</NuxtLink>
      <NuxtLink to="/cards/style">Style</NuxtLink>
    </UiNav>

    <main class="cards-content">
      <header class="page-header">
        <h1>Car<span>tons</span></h1>
        <p>Générez et personnalisez vos cartons de bingo</p>
      </header>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.cards-layout {
  min-height: 100vh;
}

.cards-content {
  margin-left: 180px;
  padding: 1rem 2rem;
  max-width: 1200px;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #1f2937;
  font-weight: 800;
}

.page-header h1 span {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 1rem;
}
</style>
