<script setup lang="ts">
</script>

<template>
  <div class="settings-page">
    <UiNav>
      <NuxtLink to="/settings/general">Général</NuxtLink>
      <NuxtLink to="/settings/bingos">Tirages</NuxtLink>
      <NuxtLink to="/settings/prizes">Lots</NuxtLink>
      <NuxtLink to="/settings/sponsors">Sponsors</NuxtLink>
      <NuxtLink to="/settings/preferences">Style</NuxtLink>
    </UiNav>

    <main class="settings-content">
      <header class="page-header">
        <h1>Para<span>mètres</span></h1>
        <p>Configurez vos parties et vos lots</p>
      </header>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
}

.settings-content {
  margin-left: 180px;
  padding: 1rem 2rem;
  max-width: 1100px;
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
