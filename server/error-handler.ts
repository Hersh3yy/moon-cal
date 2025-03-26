import { createError, defineEventHandler, H3Error } from 'h3'

export default defineEventHandler((event) => {
  const error = event.context.error as H3Error

  // Log the error for debugging
  console.error('Server error:', error)

  // Create a sanitized error object without sensitive information
  let statusCode = error?.statusCode || 500
  let statusMessage = error?.statusMessage || 'Internal Server Error'
  let message = error?.message || 'An unexpected error occurred'
  
  // Customize error responses based on path
  if (event.path?.startsWith('/blog')) {
    if (statusCode === 404) {
      statusMessage = 'Blog Post Not Found'
      message = 'The requested blog post could not be found'
    } else if (statusCode === 500) {
      statusMessage = 'Blog Error'
      message = 'There was an error loading the blog content. Please try again later.'
    }
  }

  // For API error, return a JSON response
  if (event.path?.startsWith('/api/')) {
    return {
      statusCode,
      message,
      stack: process.dev ? error?.stack : undefined
    }
  }

  // For other routes, let Nuxt handle rendering an error page
  throw createError({
    statusCode,
    statusMessage,
    message,
    fatal: true
  })
}) 