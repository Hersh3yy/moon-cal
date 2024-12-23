<template>
    <div class="container mx-auto px-4 py-12">
        <div class="max-w-4xl mx-auto text-center starry-background rounded-xl p-8">
            <h1 class="text-4xl font-bold text-white mb-8">Current Moon Phase</h1>
            <MoonDisplay />
            <div class="mt-12 max-w-2xl mx-auto">
                <MoonInfo />
            </div>
        </div>
    </div>
</template>

<script setup>
const { moonStore } = useMoonStore()
</script>

<style scoped>
.starry-background {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(25, 25, 112, 0.8));
    position: relative;
    overflow: hidden;
}

.starry-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(white 1px, transparent 1px),
        radial-gradient(white 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: 0 0, 25px 25px;
    animation: twinkle 8s infinite;
    opacity: 0.3;
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 0.6;
    }
}
</style>