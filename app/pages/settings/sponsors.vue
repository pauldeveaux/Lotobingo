<script setup lang="ts">
import SponsorForm from '~/components/sponsor/SponsorForm.vue'
import SponsorList from '~/components/sponsor/SponsorList.vue'
import type { SponsorFormData } from '~/types/sponsor'

const sponsorStore = useSponsorStore()

const editingSponsorId = ref<number | null>(null)

const editingSponsor = computed(() =>
  editingSponsorId.value ? sponsorStore.getSponsor(editingSponsorId.value) : null
)

const editingSponsorData = computed<SponsorFormData | null>(() => {
  if (!editingSponsor.value) return null
  return {
    name: editingSponsor.value.name,
    image: editingSponsor.value.image,
  }
})

function onSubmit(data: SponsorFormData): void {
  if (editingSponsorId.value) {
    sponsorStore.updateSponsor(editingSponsorId.value, data)
  } else {
    const created = sponsorStore.createSponsor(data)
    editingSponsorId.value = created.id
  }
}

function startCreate(): void {
  editingSponsorId.value = null
}

function selectForEdit(id: number): void {
  editingSponsorId.value = id
}

function deleteSponsor(id: number): void {
  sponsorStore.deleteSponsor(id)
  if (editingSponsorId.value === id) {
    editingSponsorId.value = null
  }
}
</script>

<template>
  <div class="settings-editor-page">
    <h2>{{ editingSponsor ? 'Modifier un sponsor' : 'Ajouter un nouveau sponsor' }}</h2>
    <div class="settings-editor-content">
      <SponsorForm
        :sponsor-data="editingSponsorData"
        @submit="onSubmit"
      />

      <div class="settings-editor-sidebar">
        <SponsorList
          :selected-id="editingSponsorId"
          show-create
          @select="selectForEdit"
          @create="startCreate"
          @delete="deleteSponsor"
        />
      </div>
    </div>
  </div>
</template>

<style>
@import '~/assets/css/settings-editor.css';
</style>
