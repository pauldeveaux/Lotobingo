<script setup lang="ts">
import type { BallConfig } from '~/types/bingo'

interface Props {
    number: number
    drawn?: boolean
    config?: BallConfig
    volume?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    drawn: false,
    volume: false,
    config: () => ({
        hoverable: true,
        clickable: true
    })
})

const emits = defineEmits<{
    click: [number]
}>()

function handleClick(): void {
    if (props.drawn || !props.config.clickable) return
    emits("click", props.number)
}
</script>

<template>
    <div
        @click.prevent="handleClick"
        class="ball"
        :data-number="number"
        :class="[
            drawn ? 'is-drawn': 'is-active',
            config.hoverable ? 'is-hoverable': '',
            config.clickable ? 'is-clickable': '',
            volume ? 'has-volume': ''
        ]"
        :role="config.clickable ? 'button' : 'img'"
        :tabindex="config.clickable && !drawn ? 0 : -1"
        :aria-label="`Bingo ball number ${number}`"
        :aria-disabled="drawn"
        @keydown.enter.prevent="handleClick"
        @keydown.space.prevent="handleClick"
    >
        <div v-if="volume" class="shine" aria-hidden="true"></div>
        <span class="ball-content">{{ number }}</span>
    </div>
</template>

<style scoped>
.ball {
    /* Default Blue Colors — inherit from parent CSS variable if set */
    --ball-color: var(--theme-ball-color, #6392cc);
    --ball-color-dark: color-mix(in srgb, var(--ball-color) 80%, black);
    --ball-color-light: color-mix(in srgb, var(--ball-color) 70%, white);
    --ball-text: #ffffff;
    
    /* Sizing */
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1; 
    
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    
    /* Default flat background (fallback) */
    background-color: var(--ball-color);
    color: var(--ball-text);
    
    user-select: none;
    transition: transform 0.2s ease, background-color 0.2s ease;
    font-family: sans-serif;
}

.ball-content {
    z-index: 2;
    font-weight: 800;
    font-size: 45cqw; 
    font-size: clamp(1rem, 40%, 3rem); 
    line-height: 1;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 0 10px rgba(0,0,0,0.1);
}

/* --- 3D Volume Effect --- */
.ball.has-volume {
    /* Uses variables so it updates automatically when drawn */
    background: radial-gradient(
        circle at 35% 35%,
        var(--ball-color-light) 0%,
        var(--ball-color) 25%,
        var(--ball-color-dark) 85%
    );
    box-shadow: 
        inset -0.2em -0.2em 0.4em rgba(0, 0, 0, 0.3), 
        0.1em 0.15em 0.2em rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0,0,0,0.15);
}

.shine {
    position: absolute;
    top: 5%;
    left: 10%;
    width: 45%;
    height: 25%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    transform: rotate(-45deg);
    pointer-events: none;
    z-index: 1;
}

/* --- States --- */

/* Drawn State */
.ball.is-drawn {
    /* We ONLY update the variables here.
       The gradient in .has-volume will pick these up automatically. */
    --ball-color: var(--theme-ball-drawn-color, #e74c3c);
    --ball-color-dark: color-mix(in srgb, var(--ball-color) 80%, black);
    --ball-color-light: color-mix(in srgb, var(--ball-color) 70%, white);
    
    /* Fallback for non-volume mode */
    background-color: var(--ball-color); 
    
    animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0.9;
}

.ball.is-hoverable.is-active:hover {
    transform: scale(1.1);
    filter: brightness(1.1);
    cursor: pointer;
    z-index: 10;
}

.ball.is-clickable.is-active {
    cursor: pointer;
}

@keyframes pop {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 0.9; }
}
</style>
