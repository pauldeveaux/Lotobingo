<script setup lang="ts">

const props = defineProps({
    labelReduced: {
        default: "",
        type: String
    },
    labelExtended: {
        default: "",
        type: String
    }
})

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

function toggle() {
    isOpen.value = !isOpen.value;
}


function onClickOutside(event: MouseEvent) {
    if(containerRef.value && !containerRef.value.contains(event.target as Node))
        isOpen.value = false;
}

watch(isOpen, (open) => {
    if (open) {
        setTimeout(() => {
            document.addEventListener('click', onClickOutside)
        }, 0)
    }
    else {
        document.removeEventListener('click', onClickOutside)
    }
})

onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
})
</script>

<template>
    <div class="dropdown-container" ref="containerRef">
        <slot name="dropdown-btn" :toggle="toggle" :isOpen="isOpen">
            <button @click="toggle()">{{ isOpen?  labelExtended + '▲': labelReduced + '▼' }}</button>
        </slot>
        <div v-if="isOpen" class="dropdown-content">
        <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.dropdown-container {
    display: inline-block;
    position: relative;
    overflow-x:visible;
}

.dropdown-content {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    max-height: 250px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 100;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    animation: dropdown-in 0.15s ease-out;
}

@keyframes dropdown-in {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scrollbar styling */
.dropdown-content::-webkit-scrollbar {
    width: 6px;
}

.dropdown-content::-webkit-scrollbar-track {
    background: transparent;
}

.dropdown-content::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>