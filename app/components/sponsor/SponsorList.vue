<script setup lang="ts">
const sponsorStore = useSponsorStore()

interface Props {
  selectedId?: number | null
  showCreate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: undefined,
  showCreate: false,
})

const emits = defineEmits<{
  select: [id: number]
  create: []
  delete: [id: number]
}>()

function onSelect(id: number): void {
  emits('select', id)
}

function onDelete(id: number, event: Event): void {
  event.stopPropagation()
  if (confirm('Supprimer ce sponsor ?')) {
    emits('delete', id)
  }
}
</script>

<template>
  <div class="sponsor-list">
    <ul>
      <li
        v-for="sponsor in sponsorStore.sponsorList"
        :key="sponsor.id"
        class="sponsor-item"
        :class="{ active: sponsor.id === selectedId }"
        @click="onSelect(sponsor.id)"
      >
        <div class="sponsor-photo">
          <img v-if="sponsor.image" :src="sponsor.image" :alt="sponsor.name" />
          <div v-else class="no-photo">?</div>
        </div>

        <div class="sponsor-info">
          <p class="sponsor-name">{{ sponsor.name }}</p>
        </div>

        <button class="delete-btn" @click="onDelete(sponsor.id, $event)">X</button>
      </li>

      <li v-if="showCreate" class="sponsor-item create-item" :class="{ active: selectedId === null }" @click="emits('create')">
        <span class="create-icon">+</span>
        <p class="create-text">Nouveau sponsor</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sponsor-list {
  width: 100%;
  overflow-y: auto;
  max-height: 60vh;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sponsor-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f7f7f7;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.sponsor-item:hover {
  background: #eaeaea;
}

.sponsor-item.active {
  background: #dbeafe;
  box-shadow: inset 0 0 0 1px #3b82f6;
}

.sponsor-photo {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.sponsor-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.no-photo {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.5rem;
}

.sponsor-info {
  flex: 1;
  min-width: 0;
}

.sponsor-name {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.create-item {
  border: 2px dashed #cbd5e1;
  background: transparent;
  justify-content: center;
}

.create-item:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.create-icon {
  font-size: 1.5rem;
  color: #94a3b8;
}

.create-text {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

.create-item:hover .create-icon,
.create-item:hover .create-text {
  color: #3b82f6;
}
</style>
