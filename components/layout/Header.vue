<!-- components/layout/Header.vue -->
<template>
    <div class="text-center mb-8">
        <h2 class="text-lg font-poppins">{{ currentDate }}</h2>
        <LocationSelector class="mt-4" />
    </div>
</template>

<script setup lang="ts">
const currentDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})
</script> 