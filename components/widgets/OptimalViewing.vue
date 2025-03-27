<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div v-if="hasOptimalViewingPeriod" class="moon-card-content">
            <div class="moon-card-row">
                <span class="moon-label">Best Viewing:</span>
                <span class="moon-value">{{ optimalPeriod.start_time }} - {{ optimalPeriod.end_time }}</span>
            </div>
            <div class="moon-card-row">
                <span class="moon-label">Duration:</span>
                <span class="moon-value">{{ optimalPeriod.duration_hours }} hours</span>
            </div>
            <div class="moon-card-row">
                <span class="moon-label">Quality:</span>
                <span class="moon-value">{{ optimalPeriod.viewing_quality }}</span>
            </div>
            <div class="recommendations" v-if="optimalPeriod.recommendations?.length">
                <div class="moon-label">Recommendations:</div>
                <ul class="moon-recommendations">
                    <li v-for="(tip, index) in optimalPeriod.recommendations" :key="index">
                        {{ tip }}
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="moon-card-row">
            <span class="moon-text-secondary">No optimal viewing period available today</span>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'
import { computed } from 'vue'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'science',
    colSpan: 2
})

interface OptimalViewingPeriod {
    start_time: string;
    end_time: string;
    duration_hours: number;
    viewing_quality: string;
    recommendations: string[];
}

const { moonData } = storeToRefs(useMoonStore())

const optimalPeriod = computed<OptimalViewingPeriod>(() => {
    return moonData.value?.moon?.events?.optimal_viewing_period as OptimalViewingPeriod || {
        start_time: '',
        end_time: '',
        duration_hours: 0,
        viewing_quality: '',
        recommendations: []
    }
})

const hasOptimalViewingPeriod = computed(() => {
    return !!moonData.value?.moon?.events?.optimal_viewing_period
})
</script>

<style scoped>
.moon-recommendations {
    margin-top: 0.5rem;
    margin-left: 1rem;
    font-size: 0.9rem;
}

.moon-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.recommendations {
    margin-top: 0.5rem;
}

.moon-label {
    font-weight: 500;
    color: #6b7280;
}

.moon-value {
    font-weight: 500;
}

.moon-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style> 