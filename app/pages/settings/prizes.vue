<script setup lang="ts">
import PrizeForm from '~/components/prize/PrizeForm.vue'
import PrizeList from '~/components/prize/PrizeList.vue'
import type { PrizeFormData } from '~/types/bingo'

const prizeStore = usePrizeStore()
const sidebar = ref<{ close: () => void } | null>(null)

const editingPrizeId = ref<number | null>(prizeStore.lastId ? prizeStore.lastId - 1 : null)

const editingPrize = computed(() =>
  editingPrizeId.value ? prizeStore.getPrize(editingPrizeId.value) : null
)

const editingPrizeData = computed<PrizeFormData | null>(() => {
  if (!editingPrize.value) return null
  return {
    name: editingPrize.value.name,
    value: editingPrize.value.value,
    photo: editingPrize.value.photo,
    providerName: editingPrize.value.providerName,
    providerImage: editingPrize.value.providerImage,
  }
})

function onSubmit(data: PrizeFormData): void {
  if (editingPrizeId.value) {
    prizeStore.updatePrize(editingPrizeId.value, data)
  } else {
    const created = prizeStore.createPrize(data)
    editingPrizeId.value = created.id
  }
}

function startCreate(): void {
  editingPrizeId.value = null
}

function selectForEdit(id: number): void {
  editingPrizeId.value = id
  sidebar.value?.close()
}

function deletePrize(id: number): void {
  prizeStore.deletePrize(id)
  if (editingPrizeId.value === id) {
    editingPrizeId.value = null
  }
}
</script>

<template>
  <div class="settings-editor-page">
    <h2>{{ editingPrize ? 'Modifier un lot' : 'Ajouter un nouveau lot' }}</h2>
    <div class="settings-editor-content">
      <PrizeForm
        :prize-data="editingPrizeData"
        @submit="onSubmit"
      />
    </div>

    <UiEditorSidebar ref="sidebar">
      <PrizeList
        :selected-id="editingPrizeId"
        show-create
        @select="selectForEdit"
        @create="startCreate"
        @delete="deletePrize"
      />
    </UiEditorSidebar>
  </div>
</template>

<style>
@import '~/assets/css/settings-editor.css';
</style>
