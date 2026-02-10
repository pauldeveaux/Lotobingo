<script setup lang="ts">
interface Props {
    type?: 'submit' | 'button' | 'reset'
}

withDefaults(defineProps<Props>(), {
    type: 'submit'
})
</script>

<template>
    <button :type="type" class="btn-validate" aria-label="Validate">
        <svg width="20" height="20" fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd"></path>
        </svg>
    </button>
</template>

<style scoped>
.btn-validate {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    cursor: pointer;

    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-validate:hover {
    box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
    transform: translateY(-2px);
}

.btn-validate:active {
    transform: scale(0.95);
    box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4);
}

.btn-validate:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.btn-validate:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn-validate svg {
    width: 20px;
    height: 20px;
    fill: white;
}
</style>
