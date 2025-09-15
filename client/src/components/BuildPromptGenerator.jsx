import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateBuildPrompt } from '../services/api'
import ErrorMessage from './ErrorMessage'

/**
 * BuildPromptGenerator Component - Optimized for quick AI prompt generation
 * 
 * Features:
 * - 500 character limit for faster processing
 * - Real-time character counter with visual feedback
 * - Optimized UI for quick idea input
 * - Copy-to-clipboard functionality
 * - Responsive design with Tailwind CSS
 * - Loading states with animations
 * 
 * @component
 * @example
 * return (
 *   <BuildPromptGenerator />
 * )
 */
const BuildPromptGenerator = () => {
  const [idea, setIdea] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const CHARACTER_LIMIT = 500
  const remainingChars = CHARACTER_LIMIT - idea.length
  const isNearLimit = remainingChars <= 50
  const isOverLimit = remainingChars < 0

  /**
   * Handle form submission to generate build prompt
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setError('Please enter a startup idea')
      return
    }

    if (idea.trim().length < 10) {
      setError('Please provide more details about your idea (at least 10 characters)')
      return
    }

    if (isOverLimit) {
      setError(`Please shorten your description by ${Math.abs(remainingChars)} characters`)
      return
    }

    setError('')
    setIsLoading(true)
    
    try {
      const response = await generateBuildPrompt(idea)
      setPrompt(response.data.prompt)
    } catch (err) {
      console.error('❌ Build prompt generation error:', err)
      setError(err.message || 'Failed to generate build prompt. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Copy prompt to clipboard
   */
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('❌ Failed to copy to clipboard:', err)
      setError('Failed to copy to clipboard')
    }
  }

  /**
   * Clear form and results
   */
  const handleClear = () => {
    setIdea('')
    setPrompt('')
    setError('')
    setIsCopied(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">⚡ Quick Build Prompt</h2>
            <p className="text-sm text-gray-600">Fast AI prompt generation for developers</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="build-idea" className="block text-sm font-medium text-gray-700 mb-2">
            Startup Idea
            <span className="text-gray-500 ml-1">(Quick description for fast results)</span>
          </label>
          <div className="relative">
            <textarea
              id="build-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="E.g., A food delivery app for healthy meals with AI nutrition tracking..."
              className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors duration-200 focus:outline-none focus:ring-2 ${
                isOverLimit 
                  ? 'border-red-500 focus:ring-red-500' 
                  : isNearLimit 
                    ? 'border-yellow-500 focus:ring-yellow-500' 
                    : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows={4}
              disabled={isLoading}
              aria-describedby="char-counter"
            />
            
            {/* Character Counter */}
            <div 
              id="char-counter"
              className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${
                isOverLimit 
                  ? 'bg-red-100 text-red-700' 
                  : isNearLimit 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {remainingChars} / {CHARACTER_LIMIT}
            </div>
          </div>
          
          {/* Character limit info */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Shorter descriptions = faster AI responses</span>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !idea.trim() || isOverLimit}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading || !idea.trim() || isOverLimit
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Quick Prompt
              </div>
            )}
          </button>

          {(idea || prompt) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Clear form"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      <AnimatePresence>
        {prompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quick Build Prompt
              </h3>
              <button
                onClick={handleCopyPrompt}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isCopied
                    ? 'bg-green-500 text-white focus:ring-green-500'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
                }`}
              >
                {isCopied ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </div>
                )}
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono">
                {prompt}
              </pre>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Use this prompt with your favorite AI coding assistant (ChatGPT, Claude, etc.)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BuildPromptGenerator
