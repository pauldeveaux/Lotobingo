<script setup>
const props = defineProps({
    name: String,
    value: Number,
    photo: String | undefined,
    providerName: String | undefined,
    providerImage: String | undefined,
})

</script>

<template>
  <!-- Prize Display -->
  <div class="prize-showcase">
    <div class="prize-badge">LOT</div>
    <img
      v-if="photo"
      :src="photo"
      :alt="name"
      class="prize-image"
    />
    <div class="prize-details">
      <p class="prize-name">{{ name }}</p>
      <p class="prize-value">{{ value }}€</p>
    </div>

    <div v-if="providerName" class="provider-section">
      <p class="provider-label">Offert par</p>
      <img
        v-if="providerImage"
        :src="providerImage"
        :alt="providerName"
        class="provider-image"
      />
      <p class="provider-name">{{ providerName }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Prize Showcase Styles */
.prize-showcase {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--theme-prize-panel-color, white);
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.prize-badge {
    padding: 0.25rem 0.75rem;
    background: var(--theme-prize-badge-color, #ef4444);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 4px;
    margin-bottom: 0.75rem;
}

.prize-image {
    width: var(--theme-prize-image-size, 300px);
    height: var(--theme-prize-image-size, 300px);
    object-fit:contain;
    border-radius: 8px;
}

.prize-details {
    text-align: center;
    margin-top: 0.75rem;
}

.prize-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--theme-prize-text-color, #374151);
}

.prize-value {
    margin: 0.25rem 0 0 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--theme-prize-value-color, #16a34a);
}

.provider-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    text-align: center;
}

.provider-label {
    margin: 0;
    font-size: 0.9rem;
    color: var(--theme-prize-provider-label-color, #9ca3af);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
}

.provider-image {
    width: 180px;
    height: 180px;
    object-fit: contain;
    border-radius: 8px;
    margin-top: 0.75rem;
}

.provider-name {
    margin: 0.5rem 0 0 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--theme-prize-text-color, #374151);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .prize-showcase {
        padding: 0.75rem 1rem;
    }

    .prize-image {
        width: 70px;
        height: 70px;
    }

    .prize-name {
        font-size: 0.9rem;
    }

    .prize-value {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .prize-showcase {
        margin: 1rem auto;
    }
}
</style>