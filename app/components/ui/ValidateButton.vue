<script setup lang="ts">
interface Props {
    type?: 'submit' | 'button' | 'reset'
}

withDefaults(defineProps<Props>(), {
    type: 'submit'
})
</script>

<template>
    <button :type="type" class="btn-validate">
        <svg width="20" height="20" fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd"></path>
        </svg>
    </button>
</template>

<style scoped>
.btn-validate {
    width: 45px;
    height: 45px;
    border-radius: 50%; /* rond parfait */
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #4CAF50; /* vert principal */
    color: white;
    border: none;
    cursor: pointer;

    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    transition: transform 0.1s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.btn-validate:hover {
    background-color: #45a049;
    box-shadow: 0 6px 10px rgba(0,0,0,0.2);
    transform: translateY(-2px);
}

.btn-validate:active {
    transform: scale(0.95);
    box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}

.btn-validate:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.4);
}

.btn-validate:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

/* SVG icon harmonisé */
.btn-validate svg {
    width: 20px;
    height: 20px;
    fill: white; /* force la couleur du check */
}

</style>
