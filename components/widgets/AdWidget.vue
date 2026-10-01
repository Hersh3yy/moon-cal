<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <a :href="props.adLink" class="ad-container" target="_blank" rel="noopener noreferrer">
            <div class="ad-sponsor">Sponsor</div>
            <img :src="props.imgSrc" :alt="props.sponsorName + ' Logo'" class="ad-img">
            <div class="ad-sponsor-name">{{ props.sponsorName }}</div>
            <div class="ad-description">{{ props.description }}</div>
        </a>
    </UiBaseCard>
</template>

<script setup lang="ts">
import type { BaseWidgetProps } from '@/types/widget'

interface AdWidgetProps extends BaseWidgetProps {
    sponsorName: string
    description: string
    imgSrc: string
    adLink?: string
}

const props = withDefaults(defineProps<AdWidgetProps>(), {
    mode: 'both',
    colSpan: 2,
    adLink: '#'
})
</script>

<style scoped>
.ad-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-decoration: none;
    transition: transform 0.2s ease;
}

.ad-container:hover {
    transform: translateY(-2px);
}

.ad-sponsor {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.ad-img {
    width: 100%;
    max-height: 160px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.ad-sponsor-name {
    font-weight: 600;
    font-size: 1.125rem;
    color: white;
    font-family: 'Poppins', sans-serif;
}

.ad-description {
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.8);
}
</style> 