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
 * Generate AI code prompt for a startup idea
 * @param {string} idea - The startup idea description
 * @returns {Promise<{success: boolean, prompt: string}>} - Generated code prompt
 */
export const generateCodePrompt = async (idea) => {
  if (!idea || typeof idea !== 'string') {
    throw new Error('Please provide a valid startup idea')
  }

  if (idea.trim().length < 10) {
    throw new Error('Please provide a more detailed description of your startup idea')
  }

  const response = await api.post('/code-prompt', { idea: idea.trim() })
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
