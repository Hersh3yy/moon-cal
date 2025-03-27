<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    <div class="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>
      
      <p class="text-gray-600 mb-6">
        {{ errorMessage }}
      </p>

      <div class="flex justify-center space-x-4">
        <NuxtLink 
          to="/"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Home
        </NuxtLink>
        
        <button 
          @click="handleError"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const is404 = computed(() => props.error?.statusCode === 404)

const errorMessage = computed(() => {
  if (is404.value) {
    return "Sorry, the page you're looking for doesn't exist or has been moved."
  }
  return "Sorry, something went wrong. Please try again later."
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script> 