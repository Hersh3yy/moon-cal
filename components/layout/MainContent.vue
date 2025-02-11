<template>
    <div class="space-y-8">
        <!-- Moon Display (Always Centered) -->
        <div class="flex justify-center">
            <MoonDisplay />
        </div>

        <!-- Widget Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <slot />
        </div>
    </div>
</template> 