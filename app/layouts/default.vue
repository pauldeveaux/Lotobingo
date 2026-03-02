<script setup lang="ts">
const menuOpen = ref(false);
const route = useRoute();

// Close menu on navigation
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header>
    <div class="header-content">
      <NuxtLink to="/" class="logo">Loto<span>Bingo</span></NuxtLink>
      <button
        class="menu-toggle"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Menu"
      >
        <span class="hamburger" :class="{ open: menuOpen }"></span>
      </button>
      <nav class="header-nav" :class="{ open: menuOpen }">
        <NuxtLink to="/loto/admin">Gestion</NuxtLink>
        <a href="/loto/client" target="_blank">Affichage</a>
        <NuxtLink to="/cards">Cartons</NuxtLink>
        <NuxtLink to="/settings">Paramètres</NuxtLink>
        <NuxtLink to="/tutorial">Tutoriel</NuxtLink>
        <NuxtLink to="/about">À propos</NuxtLink>
      </nav>
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>

<style scoped>
header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.logo span {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  gap: 0.25rem;
}

.header-nav a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.header-nav a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.header-nav a.router-link-active {
  color: white;
  background: linear-gradient(
    135deg,
    rgba(240, 147, 251, 0.3) 0%,
    rgba(245, 87, 108, 0.3) 100%
  );
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  min-height: calc(100vh - 60px);
  background: #f9fafb;
}

/* Hamburger toggle - hidden on desktop */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  position: relative;
  transition: background 0.2s;
}

.hamburger::before,
.hamburger::after {
  content: "";
  position: absolute;
  left: 0;
  width: 24px;
  height: 2px;
  background: white;
  transition: transform 0.2s;
}

.hamburger::before {
  top: -7px;
}
.hamburger::after {
  top: 7px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.open::after {
  transform: rotate(-45deg);
  top: 0;
}

@media (max-width: 700px) {
  .menu-toggle {
    display: block;
  }

  .header-content {
    flex-wrap: wrap;
  }

  .header-nav {
    display: none;
    flex-basis: 100%;
    flex-direction: column;
    gap: 0;
    padding-bottom: 0.5rem;
  }

  .header-nav.open {
    display: flex;
  }

  .header-nav a {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  header {
    padding: 0 1rem;
  }

  main {
    min-height: calc(100vh - 60px);
  }
}
</style>
