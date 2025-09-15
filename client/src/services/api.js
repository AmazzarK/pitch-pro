import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status)
    return response
  },
  (error) => {
    console.error('❌ Response error:', error)
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.')
    }
    
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred'
      
      if (status === 429) {
        throw new Error('Too many requests. Please wait a moment before trying again.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else if (status === 401) {
        throw new Error('Authentication failed. Please check your API key.')
      } else {
        throw new Error(message)
      }
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    } else {
      throw new Error('An unexpected error occurred.')
    }
  }
)

export const generatePitch = async (idea) => {
  if (!idea || typeof idea !== 'string') {
    throw new Error('Please provide a valid startup idea')
  }

  if (idea.trim().length < 10) {
    throw new Error('Please provide a more detailed description of your startup idea')
  }

  const response = await api.post('/generate', { idea: idea.trim() })
  return response.data
}

/**
 * Generate enhanced AI code prompt for a startup idea with optional pitch data
 * @param {string} idea - The startup idea description
 * @param {Object} [pitchData] - Optional pitch data including name, elevator pitch, and slides
 * @returns {Promise<Object>} Enhanced code prompt data with tech stack and structure
 */
export const generateCodePrompt = async (idea, pitchData = null) => {
  if (!idea || typeof idea !== 'string') {
    throw new Error('Please provide a valid startup idea')
  }

  if (idea.trim().length < 10) {
    throw new Error('Please provide a more detailed description (at least 10 characters)')
  }

  if (idea.trim().length > 2000) {
    throw new Error('Description too long (maximum 2000 characters)')
  }

  console.log('🚀 Generating enhanced code prompt...', { ideaLength: idea.trim().length, hasPitchData: !!pitchData })

  const response = await api.post('/code-prompt', { 
    idea: idea.trim(),
    pitchData: pitchData 
  })
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to generate code prompt')
  }
  
  console.log('✅ Code prompt generated successfully')
  return response.data
}

/**
 * Generate optimized build prompt for faster AI response (500 character limit)
 * @param {string} idea - The startup idea description (max 500 characters)
 * @returns {Promise<Object>} Build prompt data optimized for quick generation
 */
export const generateBuildPrompt = async (idea) => {
  if (!idea || typeof idea !== 'string') {
    throw new Error('Please provide a valid startup idea')
  }

  if (idea.trim().length < 10) {
    throw new Error('Please provide a more detailed description (at least 10 characters)')
  }

  if (idea.trim().length > 500) {
    throw new Error('Description too long (maximum 500 characters for quick generation)')
  }

  console.log('⚡ Generating optimized build prompt...', { ideaLength: idea.trim().length })

  const response = await api.post('/buildprompt', { 
    idea: idea.trim()
  })
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to generate build prompt')
  }
  
  console.log('✅ Build prompt generated successfully')
  return response.data
}

export const getPitchHistory = async (page = 1, limit = 10) => {
  const response = await api.get('/history', {
    params: { page, limit }
  })
  return response.data
}

export const getPitchById = async (id) => {
  const response = await api.get(`/history/${id}`)
  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
