<script setup lang="ts">
import { useImageUpload } from '~/composables/useImageUpload'
import type { PrizeFormData } from '~/types/bingo'

interface Props {
  prizeData?: PrizeFormData | null
}

const props = withDefaults(defineProps<Props>(), {
  prizeData: null,
})

const emits = defineEmits<{
  submit: [data: PrizeFormData]
}>()

const defaultData: PrizeFormData = {
  name: '',
  value: 0,
  photo: null,
  providerName: null,
  providerImage: null,
}

const form = reactive<PrizeFormData>({ ...defaultData })

watch(
  () => props.prizeData,
  (newData) => {
    Object.assign(form, newData ?? defaultData)
  },
  { immediate: true, deep: true },
)

const isEditing = computed(() => props.prizeData !== null)

const isDirty = computed(() => {
  if (!props.prizeData) return false
  return form.name !== props.prizeData.name ||
    form.value !== props.prizeData.value ||
    form.photo !== props.prizeData.photo ||
    form.providerName !== props.prizeData.providerName ||
    form.providerImage !== props.prizeData.providerImage
})

const { preview: photoPreview, onChange: onPhotoChange, remove: removePhoto } = useImageUpload(
  () => form.photo,
  (v) => { form.photo = v },
)

const { preview: providerImagePreview, onChange: onProviderImageChange, remove: removeProviderImage } = useImageUpload(
  () => form.providerImage,
  (v) => { form.providerImage = v },
)

function onSubmit(): void {
  emits('submit', { ...form })
  if (!isEditing.value) {
    Object.assign(form, defaultData)
    photoPreview.value = null
    providerImagePreview.value = null
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="prize-form">
    <div class="form-row">
      <label for="prize-name">Nom :</label>
      <input
        type="text"
        id="prize-name"
        v-model="form.name"
        placeholder="Nom du lot"
        required
      />
    </div>

    <div class="form-row">
      <label for="prize-value">Valeur :</label>
      <div class="input-with-unit">
        <input
          type="number"
          id="prize-value"
          v-model.number="form.value"
          min="0"
          step="0.01"
          placeholder="0"
        />
        <span class="unit">EUR</span>
      </div>
    </div>

    <div class="form-row">
      <label for="prize-photo">Photo :</label>
      <div class="photo-input">
        <input
          type="file"
          id="prize-photo"
          accept="image/*"
          @change="onPhotoChange"
        />
        <div v-if="photoPreview" class="photo-preview">
          <img :src="photoPreview" alt="Preview" />
          <button type="button" class="remove-photo" @click="removePhoto">X</button>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="form-row">
      <label for="provider-name">Fournisseur :</label>
      <input
        type="text"
        id="provider-name"
        v-model="form.providerName"
        placeholder="Nom du fournisseur (optionnel)"
      />
    </div>

    <div class="form-row">
      <label for="provider-image">Logo :</label>
      <div class="photo-input">
        <input
          type="file"
          id="provider-image"
          accept="image/*"
          @change="onProviderImageChange"
        />
        <div v-if="providerImagePreview" class="photo-preview">
          <img :src="providerImagePreview" alt="Provider preview" />
          <button type="button" class="remove-photo" @click="removeProviderImage">X</button>
        </div>
      </div>
    </div>

    <div class="form-row form-row-right">
      <span v-if="isDirty" class="dirty-indicator">Modifications non sauvegardées</span>
      <button type="submit" class="submit-btn" :class="{ 'has-changes': isDirty }">
        {{ isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.prize-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 500px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

label {
  width: 80px;
  font-weight: 600;
  text-align: right;
  color: #374151;
}

input[type="text"],
input[type="number"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
}

input:focus {
  border-color: #f093fb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.input-with-unit input {
  flex: 1;
}

.unit {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.photo-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input[type="file"] {
  padding: 0.5rem;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.2s;
}

input[type="file"]:hover {
  border-color: #f093fb;
}

.photo-preview {
  position: relative;
  width: 100px;
  height: 100px;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-photo {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  transition: transform 0.2s;
}

.remove-photo:hover {
  transform: scale(1.1);
}

.section-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
}

.form-row-right {
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

.dirty-indicator {
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dirty-indicator::before {
  content: "●";
  font-size: 0.6rem;
}

.submit-btn.has-changes {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  animation: pulse 2s infinite;
}

.submit-btn.has-changes:hover {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.6);
  }
}
</style>
