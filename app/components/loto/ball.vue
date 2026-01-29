<script setup>
    const props = defineProps({
        number: Number,
        drawn: { type: Boolean, default : false },
        config: {
            type: Object,
            default: () => ({
                hoverable: true,
                clickable : true
            })
        }
    })

    const emits = defineEmits(["click"]);

    function handleClick() {
        if (props.drawn)
            return
        emits("click");
    }

</script>

<template>
    <div 
        @click.prevent="handleClick" 
        class="ball" 
        :class="[
            drawn ? 'drawn': 'not-drawn', 
            config.hoverable ? 'hoverable': '',
            config.clickable ? 'clickable': ''
        ]"
    >
        <p>{{ number }}</p>
    </div>
</template>

<style scoped>
.ball {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    background-color: rgb(99, 146, 204);
    color: white;
}

.ball p {
    margin: 0;
    font-weight: bold;
    font-size: 1rem;
}

.drawn {
    background-color: red;
    animation: pop 0.3s ease;
}

.hoverable.not-drawn:hover {
    transform: scale(1.1);
    background-color: #558ed1;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.clickable.not-drawn {
    cursor: pointer;
}

@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
</style>