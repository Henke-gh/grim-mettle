<template>
    <button :class="['defaultButton', theme]" @click="handleClick" :type="type">
        {{ text }}
    </button>
</template>

<script setup>
const props = defineProps({
    text: String,
    routeTo: String,
    theme: { type: String, default: 'default' },
    type: {
        type: String,
        default: 'button',
        validator: (value) => ['button', 'submit', 'reset'].includes(value)
    }
})

const emit = defineEmits(['click']);

const handleClick = (event) => {
    if (props.routeTo) {
        navigateTo(props.routeTo)
    } else {
        emit('click', event)
    }
}
</script>

<style scoped>
.defaultButton {
    border: none;
    border-radius: 5px;
    font-family: monospace;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem 0.8rem 0.5rem;
    box-shadow: 2px 2px 5px var(--warm-black);
    cursor: pointer;
}

.default {
    background-color: var(--dark-green);
    color: var(--bone-white);
}

.secondary {
    background-color: var(--brown);
    color: var(--bone-white);
}

.light {
    background-color: var(--bone-white);
    color: var(--warm-black);
}
</style>