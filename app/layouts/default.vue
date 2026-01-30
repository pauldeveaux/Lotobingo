<script setup lang="ts">
</script>

<template>
    <header>
        <NuxtLink to="/">Accueil</NuxtLink>
        <NuxtLink to="/loto/admin">Loto Admin</NuxtLink>
        <NuxtLink to="/loto/client">Loto Client</NuxtLink>
        <NuxtLink to="/settings">Paramètres</NuxtLink>
        <NuxtLink to="/">A propos</NuxtLink>
    </header>
    <main>
        <slot/>
    </main>
</template>


<style scoped>
header {
    background-color: #333;
    padding: 1rem;
}
header a {
    color: white;
    margin-right: 1rem;
    text-decoration: none;
}

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
}
</style>