<script setup lang="ts">
import BingoChoice from "~/components/loto/admin/BingoChoice.vue";
import CreateForm from "~/components/loto/settings/CreateForm.vue";
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import type { BingoFormData } from "~/types/bingo";

const bingoStore = useBingoStore();
const sidebar = ref<{ close: () => void } | null>(null);

// Local state for editing - doesn't affect the global currentBingoId
const editingBingoId = ref<number | null>(1);
const errorMessage = ref<string>("");

const editingBingo = computed(() =>
  editingBingoId.value ? bingoStore.bingos[editingBingoId.value] : null,
);

const editingBingoFormData = computed<BingoFormData | null>(() => {
  if (!editingBingo.value) return null;
  return {
    name: editingBingo.value.settings.name,
    type: editingBingo.value.settings.type,
    maxNumber: editingBingo.value.settings.maxNumber,
    prizeIds: editingBingo.value.prizeIds,
  };
});

function onBingoSubmit(bingoSettings: BingoFormData): void {
  if (editingBingoId.value) {
    bingoStore.updateBingo(editingBingoId.value, bingoSettings);
  } else {
    const createdBingo = bingoStore.createBingo(bingoSettings);
    editingBingoId.value = createdBingo.id;
  }
  errorMessage.value = "";
}

function startCreate(): void {
  editingBingoId.value = null;
  errorMessage.value = "";
}

function selectForEdit(bingoId: number): void {
  editingBingoId.value = bingoId;
  errorMessage.value = "";
  sidebar.value?.close();
}

function deleteBingo(bingoId: number): void {
  try {
    bingoStore.deleteBingo(bingoId);
    if (editingBingoId.value === bingoId) {
      editingBingoId.value = null;
    }
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = (err as Error).message;
  }
}
</script>

<template>
  <div class="settings-editor-page">
    <h2>{{ editingBingo ? "Modifier un tirage" : "Créer un nouveau tirage" }}</h2>

    <div class="settings-editor-content">
      <CreateForm
        @bingo-created="onBingoSubmit($event)"
        :default-title="'Tirage #' + bingoStore.nextId"
        :bingo-settings="editingBingoFormData"
      />
    </div>

    <UiEditorSidebar ref="sidebar">
      <BingoChoice
        @choice="selectForEdit($event)"
        @create="startCreate"
        @delete="deleteBingo($event)"
        :sync-to-store="false"
        :selected-id="editingBingoId"
        show-create
        show-delete
        draggable
      />
    </UiEditorSidebar>

    <ErrorMessage :message="errorMessage" @dismiss="errorMessage=''"/>
  </div>
</template>

<style>
@import '~/assets/css/settings-editor.css';
</style>

