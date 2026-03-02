<script setup lang="ts">
const quickActions = [
  {
    title: 'Administration',
    description: 'Gérer les tirages et contrôler la partie',
    icon: '🎮',
    to: '/loto/admin',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Affichage',
    description: 'Écran de projection pour le public',
    icon: '📺',
    to: '/loto/client',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: 'Cartons',
    description: 'Générer et personnaliser les cartons',
    icon: '🎨',
    to: '/cards',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: 'Paramètres',
    description: 'Configurer les parties et les lots',
    icon: '⚙️',
    to: '/settings',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

function handleAction(action: { to: string }) {
  if (action.to === '/loto/client') {
    window.open(action.to, '_blank')
  } else {
    navigateTo(action.to)
  }
}

const steps = [
  { title: 'Créez vos parties', description: 'Configurez vos bingos et lots' },
  { title: 'Lancez l\'affichage', description: 'Projetez sur grand écran' },
  { title: 'Tirez les numéros', description: 'Gérez le tirage en direct' }
]
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="ball ball-1">7</div>
        <div class="ball ball-2">42</div>
        <div class="ball ball-3">15</div>
        <div class="ball ball-4">88</div>
        <div class="ball ball-5">23</div>
      </div>

      <div class="hero-grid">
        <div class="hero-content">
          <h1>Loto<span>Bingo</span></h1>
          <p class="tagline">Gérez vos lotos en toute simplicité</p>
          <div class="hero-buttons">
            <NuxtLink to="/loto/admin" class="btn btn-primary">Commencer</NuxtLink>
            <NuxtLink to="/about" class="btn btn-secondary">En savoir plus</NuxtLink>
          </div>
        </div>

        <div class="hero-steps">
          <div v-for="(step, index) in steps" :key="index" class="mini-step">
            <span class="mini-step-number">{{ index + 1 }}</span>
            <div>
              <strong>{{ step.title }}</strong>
              <span>{{ step.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <div class="section-header">
        <h2>Accès <span>rapide</span></h2>
      </div>
      <div class="actions-grid">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.title"
          :to="action.to"
          class="action-card"
          @click.prevent="handleAction(action)"
        >
          <div class="action-icon-wrapper" :style="{ background: action.gradient }">
            <span class="action-icon">{{ action.icon }}</span>
          </div>
          <div class="action-text">
            <h3>{{ action.title }}</h3>
            <p>{{ action.description }}</p>
          </div>
          <span class="action-arrow">→</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem 3rem;
}

/* Hero Section */
.hero {
  position: relative;
  padding: 3rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.12;
}

.ball {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a1a2e;
  box-shadow: inset -3px -3px 8px rgba(0,0,0,0.2);
  animation: float 6s ease-in-out infinite;
}

.ball-1 { top: 10%; left: 5%; animation-delay: 0s; }
.ball-2 { top: 70%; left: 15%; animation-delay: 1s; }
.ball-3 { top: 15%; right: 25%; animation-delay: 2s; }
.ball-4 { top: 75%; right: 5%; animation-delay: 3s; }
.ball-5 { top: 45%; left: 40%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-steps {
    justify-content: center;
  }
}

.hero-content h1 {
  font-size: 4rem;
  margin: 0;
  color: white;
  font-weight: 800;
  letter-spacing: -1px;
}

.hero-content h1 span {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 2rem 0;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-buttons {
    justify-content: center;
  }
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
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Hero Steps */
.hero-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mini-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.mini-step:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(5px);
}

.mini-step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.mini-step div {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.mini-step strong {
  color: white;
  font-size: 0.95rem;
}

.mini-step span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* Section Header */
.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  color: #1f2937;
  font-weight: 700;
  margin: 0;
}

.section-header h2 span {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 600px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.action-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  flex: 1;
  min-width: 0;
}

.action-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.05rem;
  color: #1f2937;
  font-weight: 600;
}

.action-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.4;
}

.action-arrow {
  font-size: 1.25rem;
  color: #d1d5db;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.action-card:hover .action-arrow {
  color: #f5576c;
  transform: translateX(5px);
}
</style>
