<script setup lang="ts">
const sections = [
  {
    id: 'setup',
    title: 'Configuration',
    icon: '⚙️',
    steps: [
      {
        title: 'Créer une partie',
        description: 'Allez dans Paramètres > Bingo et créez une nouvelle partie avec un nom, un type (Quine, Double Quine, Carton plein) et le nombre maximum de numéros (75 ou 90).'
      },
      {
        title: 'Ajouter des lots',
        description: 'Dans Paramètres > Lots, créez vos récompenses avec un nom, une valeur et optionnellement une photo.'
      },
      {
        title: 'Associer les lots',
        description: 'Attribuez un lot à chaque partie pour qu\'il s\'affiche automatiquement pendant le tirage.'
      }
    ]
  },
  {
    id: 'cards',
    title: 'Cartons',
    icon: '🎨',
    steps: [
      {
        title: 'Générer des cartons',
        description: 'Accédez à Cartons > Générer, choisissez le type (75 ou 90 boules) et le nombre de cartons à créer.'
      },
      {
        title: 'Personnaliser le style',
        description: 'Dans Cartons > Style, définissez les couleurs de vos cartons. Choisissez un style uniforme ou aléatoire.'
      },
      {
        title: 'Imprimer les cartons',
        description: 'Visualisez vos cartons dans Cartons > Mes cartons et utilisez la fonction d\'impression du navigateur.'
      }
    ]
  },
  {
    id: 'game',
    title: 'Pendant la partie',
    icon: '🎮',
    steps: [
      {
        title: 'Ouvrir l\'affichage',
        description: 'Sur l\'écran de projection, ouvrez Loto Client en plein écran (F11). Cet écran affichera les numéros tirés en temps réel.'
      },
      {
        title: 'Lancer l\'administration',
        description: 'Sur votre ordinateur, ouvrez Loto Admin. Vous verrez la grille de numéros et les contrôles de tirage.'
      },
      {
        title: 'Tirer les numéros',
        description: 'Cliquez sur "Aléatoire" pour un tirage automatique, ou entrez manuellement un numéro. L\'affichage client se met à jour instantanément.'
      },
      {
        title: 'Gérer les erreurs',
        description: 'Vous pouvez annuler un tirage en cliquant sur le numéro dans l\'historique. Utilisez "Réinitialiser" pour recommencer une partie.'
      }
    ]
  },
  {
    id: 'tips',
    title: 'Astuces',
    icon: '💡',
    steps: [
      {
        title: 'Plusieurs parties',
        description: 'Créez toutes vos parties à l\'avance et passez de l\'une à l\'autre avec le sélecteur dans l\'administration.'
      },
      {
        title: 'Connexion réseau',
        description: 'L\'admin et le client doivent être sur le même réseau. Le client se reconnecte automatiquement en cas de coupure.'
      },
      {
        title: 'Sauvegarde automatique',
        description: 'Toutes les données sont sauvegardées localement. Vous pouvez fermer le navigateur et reprendre plus tard.'
      }
    ]
  }
]

const activeSectionId = ref('setup')

const currentSection = computed(() => {
  return sections.find(s => s.id === activeSectionId.value) ?? sections[0]
})
</script>

<template>
  <div class="tutorial-page">
    <header class="tutorial-header">
      <h1>Tuto<span>riel</span></h1>
      <p>Apprenez à utiliser LotoBingo en quelques étapes</p>
    </header>

    <div class="tutorial-layout">
      <nav class="tutorial-nav">
        <button
          v-for="section in sections"
          :key="section.id"
          :class="['nav-item', { active: activeSectionId === section.id }]"
          @click="activeSectionId = section.id"
        >
          <span class="nav-icon">{{ section.icon }}</span>
          <span class="nav-title">{{ section.title }}</span>
        </button>
      </nav>

      <main class="tutorial-content">
        <Transition name="fade">
          <section :key="currentSection.id" class="content-section">
            <div class="section-title">
              <span class="section-icon">{{ currentSection.icon }}</span>
              <h2>{{ currentSection.title }}</h2>
            </div>

            <div class="steps-list">
              <div
                v-for="(step, index) in currentSection.steps"
                :key="index"
                class="step-card"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </section>
        </Transition>
      </main>
    </div>

    <footer class="tutorial-footer">
      <NuxtLink to="/loto/admin" class="btn btn-primary">
        Commencer maintenant
      </NuxtLink>
      <NuxtLink to="/" class="btn btn-secondary">
        Retour à l'accueil
      </NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.tutorial-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 2rem 3rem;
}

/* Header */
.tutorial-header {
  text-align: center;
  margin-bottom: 3rem;
}

.tutorial-header h1 {
  font-size: 3rem;
  margin: 0;
  color: #1f2937;
  font-weight: 800;
}

.tutorial-header h1 span {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tutorial-header p {
  margin: 0.75rem 0 0 0;
  color: #6b7280;
  font-size: 1.1rem;
}

/* Layout */
.tutorial-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .tutorial-layout {
    grid-template-columns: 1fr;
  }
}

/* Navigation */
.tutorial-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  top: 1rem;
  height: fit-content;
}

@media (max-width: 768px) {
  .tutorial-nav {
    flex-direction: row;
    overflow-x: auto;
    position: static;
    padding-bottom: 0.5rem;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.nav-item.active {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(26, 26, 46, 0.3);
}

.nav-item.active .nav-title {
  color: white;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.nav-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #374151;
  white-space: nowrap;
}

/* Content */
.tutorial-content {
  min-height: 400px;
  position: relative;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-icon {
  font-size: 2rem;
}

.section-title h2 {
  font-size: 1.75rem;
  margin: 0;
  color: #1f2937;
  font-weight: 700;
}

/* Steps */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-card {
  display: flex;
  gap: 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.step-card:hover {
  border-color: transparent;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transform: translateX(5px);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.step-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

.step-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Footer */
.tutorial-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Transitions */
.fade-enter-active {
  transition: opacity 0.2s ease;
}

.fade-leave-active {
  transition: opacity 0.15s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
