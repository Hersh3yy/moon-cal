<!-- components/layout/ErrorMessage.vue -->
<template>
    <div class="text-red-500 text-center py-4">
        {{ message }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    message: string
}>()</script> 