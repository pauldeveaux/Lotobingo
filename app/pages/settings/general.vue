<script setup lang="ts">
import { useImageUpload } from '~/composables/useImageUpload'

const bingoStore = useBingoStore()

const { preview: logoPreview, onChange: onLogoChange, remove: removeLogo } = useImageUpload(
  () => bingoStore.lotoLogo,
  (v) => { bingoStore.lotoLogo = v },
)
</script>

<template>
  <div class="general-page">
    <h2 class="settings-title">Général</h2>

    <!-- Live preview card -->
    <section class="preview-card">
      <img v-if="logoPreview" :src="logoPreview" alt="Logo" class="preview-logo" />
      <div v-else class="preview-logo-placeholder">Logo</div>
      <div class="preview-text">
        <p class="preview-name">{{ bingoStore.lotoName || 'Nom du loto' }}</p>
        <p class="preview-subtitle">{{ bingoStore.lotoSubtitle || 'Sous-titre' }}</p>
      </div>
    </section>

    <!-- Event info -->
    <section class="settings-section">
      <h3>Événement</h3>

      <div class="field">
        <label for="loto-name">Nom du loto</label>
        <input
          type="text"
          id="loto-name"
          v-model="bingoStore.lotoName"
          placeholder="Ex : Loto des associations"
        />
      </div>

      <div class="field">
        <label for="loto-subtitle">Sous-titre</label>
        <input
          type="text"
          id="loto-subtitle"
          v-model="bingoStore.lotoSubtitle"
          placeholder="Ex : Édition 2026 — Salle des fêtes"
        />
      </div>
    </section>

    <!-- Logo -->
    <section class="settings-section">
      <h3>Logo</h3>
      <p class="section-hint">Affiché à côté du titre sur l'écran de projection.</p>

      <div class="logo-upload">
        <div v-if="logoPreview" class="logo-preview">
          <img :src="logoPreview" alt="Logo preview" />
          <button type="button" class="remove-btn" @click="removeLogo">Supprimer</button>
        </div>
        <label v-else class="upload-zone">
          <span class="upload-icon">+</span>
          <span class="upload-label">Choisir une image</span>
          <input type="file" accept="image/*" @change="onLogoChange" />
        </label>
      </div>
    </section>
  </div>
</template>

<style>
@import '~/assets/css/settings-editor.css';
</style>

<style scoped>
.general-page {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Live preview */
.preview-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.preview-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px;
}

.preview-logo-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.preview-text {
  text-align: left;
}

.preview-name {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.preview-subtitle {
  margin: 0.15rem 0 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Sections */
.settings-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.settings-section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-hint {
  margin: -0.25rem 0 0.75rem 0;
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Fields */
.field {
  margin-bottom: 1rem;
}

.field:last-child {
  margin-bottom: 0.25rem;
}

.field label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.field input[type="text"] {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
  box-sizing: border-box;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
}

.field input:focus {
  border-color: #f093fb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15);
  background: white;
}

/* Logo upload */
.logo-upload {
  display: flex;
  justify-content: center;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.upload-zone:hover {
  border-color: #f093fb;
  background: #fdf2f8;
}

.upload-zone input[type="file"] {
  display: none;
}

.upload-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 300;
  transition: background 0.2s;
}

.upload-zone:hover .upload-icon {
  background: #f3e8ff;
  color: #a855f7;
}

.upload-label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.logo-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.logo-preview img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 8px;
}

.remove-btn {
  padding: 0.35rem 0.85rem;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.remove-btn:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}
</style>
