<script setup>
const props = defineProps({
    name: String,
    image: String | undefined
})
</script>

<template>
  <div class="sponsor-showcase">
    <div class="sponsor-badge">SPONSOR</div>
    <img
      v-if="image"
      :src="image"
      :alt="name"
      class="sponsor-image"
    />
    <div class="sponsor-details">
      <p class="sponsor-name">{{ name }}</p>
    </div>
  </div>
</template>

<style scoped>
.sponsor-showcase {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--theme-sponsor-panel-color, white);
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sponsor-badge {
    padding: 0.25rem 0.75rem;
    background: var(--theme-sponsor-badge-color, #3b82f6);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 4px;
    margin-bottom: 0.75rem;
}

.sponsor-image {
    width: var(--theme-sponsor-image-size, 300px);
    height: var(--theme-sponsor-image-size, 300px);
    object-fit: contain;
    border-radius: 8px;
}

.sponsor-details {
    text-align: center;
    margin-top: 0.75rem;
}

.sponsor-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--theme-sponsor-text-color, #374151);
}

</style>
