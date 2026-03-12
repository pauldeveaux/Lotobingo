<script setup lang="ts">
const features = [
  {
    title: 'Gestion des tirages',
    description: 'Créez et gérez plusieurs parties de bingo avec tirage manuel ou aléatoire.',
    icon: '🎱'
  },
  {
    title: 'Affichage en temps réel',
    description: 'Projetez les numéros tirés sur grand écran avec synchronisation instantanée.',
    icon: '📺'
  },
  {
    title: 'Gestion des lots',
    description: 'Créez vos lots avec photos et valeurs, attribuez-les à chaque partie.',
    icon: '🎁'
  },
  {
    title: 'Cartons personnalisables',
    description: 'Générez des cartons 75 ou 90 boules avec vos propres styles de couleurs.',
    icon: '🎨'
  }
]
</script>

<template>
  <div class="about-page">
    <section class="hero">
      <h1>LotoBingo</h1>
      <p class="tagline">Application de gestion de loto/bingo en temps réel</p>
      <p class="subtitle">Conçue pour les associations, clubs et événements</p>
    </section>

    <section class="features">
      <h2>Fonctionnalités</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <span class="feature-icon">{{ feature.icon }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <section class="tech">
      <h2>Technologies</h2>
      <div class="tech-list">
        <span class="tech-badge">Nuxt 4</span>
        <span class="tech-badge">Vue 3</span>
        <span class="tech-badge">TypeScript</span>
        <span class="tech-badge">Pinia</span>
        <span class="tech-badge">WebSocket</span>
        <span class="tech-badge">Electron</span>
        <span class="tech-badge">i18n</span>
      </div>
    </section>

    <section class="license">
      <h2>Licence</h2>
      <div class="license-content">
        <p>
          Ce projet est open source sous licence <strong>AGPL-3.0</strong>.
        </p>
        <div class="license-details">
          <div class="license-column">
            <h4>Vous pouvez</h4>
            <ul>
              <li>Utiliser gratuitement pour vos événements</li>
              <li>Modifier le code source</li>
              <li>Distribuer le logiciel</li>
            </ul>
          </div>
          <div class="license-column">
            <h4>Vous devez</h4>
            <ul>
              <li>Garder le code source ouvert</li>
              <li>Partager vos modifications</li>
              <li>Conserver la même licence</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="links">
      <a
        href="https://github.com/pauldeveaux/Lotobingo"
        target="_blank"
        rel="noopener noreferrer"
        class="link-btn"
      >
        Voir sur GitHub
      </a>
    </section>

    <footer class="about-footer">
      <p>Développé avec passion pour la communauté associative</p>
    </footer>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin: 0;
  color: #1f2937;
}

.tagline {
  font-size: 1.25rem;
  color: #3498db;
  margin: 0.5rem 0;
  font-weight: 500;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.tech-badge {
  background: #e8f4fc;
  color: #3498db;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.license-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.license-content > p {
  text-align: center;
  margin: 0 0 1.5rem 0;
  color: #374151;
}

.license-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.license-column h4 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.license-column ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #6b7280;
}

.license-column li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.links {
  text-align: center;
}

.link-btn {
  display: inline-block;
  background: #1f2937;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.link-btn:hover {
  background: #374151;
}

.about-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 0.9rem;
}

.about-footer p {
  margin: 0;
}
</style>
