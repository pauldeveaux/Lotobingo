<script setup lang="ts">
import { useImageUpload } from '~/composables/useImageUpload'
import type { SponsorFormData } from '~/types/sponsor'

interface Props {
  sponsorData?: SponsorFormData | null
}

const props = withDefaults(defineProps<Props>(), {
  sponsorData: null,
})

const emits = defineEmits<{
  submit: [data: SponsorFormData]
}>()

const defaultData: SponsorFormData = {
  name: '',
  image: null,
}

const form = reactive<SponsorFormData>({ ...defaultData })

watch(
  () => props.sponsorData,
  (newData) => {
    Object.assign(form, newData ?? defaultData)
  },
  { immediate: true, deep: true },
)

const isEditing = computed(() => props.sponsorData !== null)

const isDirty = computed(() => {
  if (!props.sponsorData) return false
  return form.name !== props.sponsorData.name ||
    form.image !== props.sponsorData.image
})

const { preview: imagePreview, onChange: onImageChange, remove: removeImage } = useImageUpload(
  () => form.image,
  (v) => { form.image = v },
)

function onSubmit(): void {
  emits('submit', { ...form })
  if (!isEditing.value) {
    Object.assign(form, defaultData)
    imagePreview.value = null
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="sponsor-form">
    <div class="form-row">
      <label for="sponsor-name">Nom :</label>
      <input
        type="text"
        id="sponsor-name"
        v-model="form.name"
        placeholder="Nom du sponsor"
        required
      />
    </div>

    <div class="form-row">
      <label for="sponsor-image">Logo :</label>
      <div class="photo-input">
        <input
          type="file"
          id="sponsor-image"
          accept="image/*"
          @change="onImageChange"
        />
        <div v-if="imagePreview" class="photo-preview">
          <img :src="imagePreview" alt="Preview" />
          <button type="button" class="remove-photo" @click="removeImage">X</button>
        </div>
      </div>
    </div>

    <div class="form-row form-row-right">
      <span v-if="isDirty" class="dirty-indicator">Modifications non sauvegardees</span>
      <button type="submit" class="submit-btn" :class="{ 'has-changes': isDirty }">
        {{ isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.sponsor-form {
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

input[type="text"] {
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
  content: "\25CF";
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
