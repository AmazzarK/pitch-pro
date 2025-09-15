import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Terminal,
  FileCode,
  Zap,
  X,
  Folder,
  Settings,
  Database,
  ArrowDown
} from 'lucide-react'
import { generateCodePrompt } from '../services/api'

/**
 * @typedef {Object} CodePromptGeneratorProps
 * @property {string} idea - The startup idea description
 * @property {Object} [pitchData] - Optional pitch data including name, elevator pitch, and slides
 */

/**
 * @typedef {Object} PromptData
 * @property {string} prompt - The generated prompt text
 * @property {string[]} techStack - Recommended tech stack
 * @property {Object} fileStructure - Suggested file/folder structure
 * @property {string} summary - Brief project summary
 */

/**
 * AI Code Prompt Generator Component with Enhanced Features
 * Generates comprehensive, actionable code prompts for AI coding tools
 * 
 * Features:
 * - Advanced prompt generation with tech stack recommendations
 * - Keyboard accessible modal interface
 * - Copy to clipboard with success feedback
 * - Mobile-responsive design
 * - Error handling and loading states
 * 
 * @param {CodePromptGeneratorProps} props - Component props
 * @returns {JSX.Element} Enhanced code prompt generator component
 */
const CodePromptGenerator = ({ idea, pitchData }) => {
  // State management with proper typing
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState(/** @type {PromptData|null} */ (null))
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Refs for accessibility
  const modalRef = useRef(/** @type {HTMLDivElement|null} */ (null))
  const firstFocusableRef = useRef(/** @type {HTMLButtonElement|null} */ (null))

  // Keyboard accessibility
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal()
      }
    }
    
    const handleTabKey = (event) => {
      if (!showModal || !modalRef.current) return
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            event.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            event.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('keydown', handleTabKey)
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [showModal])

  // Focus management for modal
  useEffect(() => {
    if (showModal && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [showModal])

  /**
   * Show toast notification
   * @param {string} message - Toast message to display
   */
  const showToast = useCallback((message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }, [])

  /**
   * Close modal with cleanup
   */
  const closeModal = useCallback(() => {
    setShowModal(false)
    setError('')
  }, [])

  /**
   * Validate startup idea input
   * @param {string} ideaInput - The idea to validate
   * @returns {{isValid: boolean, error: string}} Validation result
   */
  const validateIdea = useCallback((ideaInput) => {
    if (!ideaInput || typeof ideaInput !== 'string') {
      return { isValid: false, error: 'Please provide a valid startup idea' }
    }
    
    const trimmedIdea = ideaInput.trim()
    if (trimmedIdea.length < 10) {
      return { isValid: false, error: 'Please provide a more detailed description (at least 10 characters)' }
    }
    
    if (trimmedIdea.length > 2000) {
      return { isValid: false, error: 'Description too long (maximum 2000 characters)' }
    }
    
    return { isValid: true, error: '' }
  }, [])

  /**
   * Handle scroll to Quick Build Prompt section
   */
  const handleScrollToQuickPrompt = useCallback(() => {
    const element = document.getElementById('quick-build-prompt');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      showToast('Scrolled to Quick Build Prompt Generator! ⚡');
    }
  }, [showToast]);

  /**
   * Enhanced prompt generation with validation and error handling
   */
  const handleGeneratePrompt = useCallback(async () => {
    const validation = validateIdea(idea)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedData(null)

    try {
      const response = await generateCodePrompt(idea, pitchData)
      
      if (response.success && response.data) {
        setGeneratedData(response.data)
        setShowModal(true)
        showToast('Code prompt generated successfully!')
      } else {
        throw new Error(response.message || 'Failed to generate prompt')
      }
    } catch (err) {
      console.error('Code prompt generation error:', err)
      const errorMessage = err.message || 'Failed to generate code prompt. Please try again.'
      setError(errorMessage)
      showToast('Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [idea, pitchData, validateIdea, showToast])

  /**
   * Enhanced copy to clipboard with better error handling
   */
  const handleCopyToClipboard = useCallback(async () => {
    if (!generatedData?.prompt) return
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedData.prompt)
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = generatedData.prompt
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!successful) {
          throw new Error('Copy command failed')
        }
      }
      
      setCopied(true)
      showToast('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToast('Failed to copy. Please select and copy manually.')
    }
  }, [generatedData?.prompt, showToast])

  /**
   * Enhanced download functionality
   */
  const handleDownloadPrompt = useCallback(() => {
    if (!generatedData?.prompt) return
    
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `ai-code-prompt-${timestamp}.txt`
      
      const element = document.createElement('a')
      const file = new Blob([generatedData.prompt], { type: 'text/plain;charset=utf-8' })
      element.href = URL.createObjectURL(file)
      element.download = filename
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(element.href)
      
      showToast('Prompt downloaded successfully!')
    } catch (err) {
      console.error('Download failed:', err)
      showToast('Download failed. Please try copying instead.')
    }
  }, [generatedData?.prompt, showToast])

  /**
   * Open AI coding tool in new tab
   * @param {string} toolUrl - URL of the AI tool
   * @param {string} toolName - Name of the AI tool
   */
  const openAITool = useCallback((toolUrl, toolName) => {
    try {
      window.open(toolUrl, '_blank', 'noopener,noreferrer')
      showToast(`Opening ${toolName}...`)
    } catch (err) {
      console.error('Failed to open AI tool:', err)
      showToast(`Failed to open ${toolName}`)
    }
  }, [showToast])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const validation = validateIdea(idea)
  const isValidIdea = validation.isValid

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Component */}
      <motion.section
        className="py-12 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-4xl">
          
          {/* Header Section */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Code2 className="h-8 w-8 text-secondary-400 glow" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text">
                AI Code Generator
              </h2>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-3"
              >
                <Terminal className="h-8 w-8 text-accent-400 glow" />
              </motion.div>
            </div>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Generate a comprehensive, actionable prompt for AI coding tools to build your entire MERN stack application
            </p>
          </motion.div>

          {/* Generate Button */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {/* Primary Generate Button */}
              <motion.button
                onClick={handleGeneratePrompt}
                disabled={isGenerating || !isValidIdea}
                className="btn-secondary text-lg py-4 px-8 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={isValidIdea ? { scale: 1.05, y: -2 } : {}}
                whileTap={isValidIdea ? { scale: 0.95 } : {}}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Generating Code Prompt...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="h-6 w-6" />
                    <span>Generate AI Code Prompt</span>
                    <Zap className="h-6 w-6" />
                  </>
                )}
              </motion.button>

              {/* Quick Build Prompt Navigation Button */}
              <motion.button
                onClick={handleScrollToQuickPrompt}
                className="btn-ghost text-lg py-4 px-6 flex items-center space-x-3 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-200 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="Navigate to Quick Build Prompt Generator (500 char limit, faster response)"
              >
                <svg className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="group-hover:text-blue-400 transition-colors duration-200">Quick Build Prompt</span>
                <ArrowDown className="h-5 w-5 group-hover:text-blue-400 transition-colors duration-200" />
              </motion.button>
            </div>

            {/* Helper text */}
            <motion.div 
              className="mt-4 text-center text-sm text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>💡 <strong>Comprehensive Prompt</strong> (above) or <strong>Quick Prompt</strong> (below) for faster results</p>
            </motion.div>
            
            {!isValidIdea && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-neutral-400 text-sm mt-3"
              >
                💡 {validation.error}
              </motion.p>
            )}
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <div className="glass-card p-4 bg-red-500/10 border-red-500/20 text-red-400 text-center">
                  ⚠️ {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
      {/* Enhanced Modal */}
      <AnimatePresence>
        {showModal && generatedData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* Modal */}
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-white/20 rounded-2xl overflow-hidden"
              variants={modalVariants}
              role="dialog"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 id="modal-title" className="text-xl font-semibold text-white flex items-center">
                    <Code2 className="h-6 w-6 mr-2 text-primary-400" />
                    Generated Code Prompt
                  </h3>
                  <p id="modal-description" className="text-sm text-neutral-400 mt-1">
                    Copy this comprehensive prompt and use it with your preferred AI coding tool
                  </p>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={closeModal}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-6">
                  {/* Tech Stack & Summary */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Tech Stack */}
                    {generatedData.techStack && (
                      <div className="glass-card p-4 bg-primary-500/5 border-primary-500/20">
                        <h4 className="text-sm font-semibold text-primary-400 mb-3 flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Recommended Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedData.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-500/10 text-primary-300 rounded-full text-xs border border-primary-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* File Structure */}
                    {generatedData.fileStructure && (
                      <div className="glass-card p-4 bg-secondary-500/5 border-secondary-500/20">
                        <h4 className="text-sm font-semibold text-secondary-400 mb-3 flex items-center">
                          <Folder className="h-4 w-4 mr-2" />
                          Project Structure
                        </h4>
                        <div className="text-xs text-neutral-300 font-mono">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(generatedData.fileStructure, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Main Prompt */}
                  <div className="glass-card p-6 relative">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Terminal className="h-5 w-5 mr-2 text-accent-400" />
                      Complete Development Prompt
                    </h4>
                    
                    <div className="relative">
                      <pre className="bg-neutral-950/80 border border-white/10 rounded-xl p-6 text-neutral-200 text-sm leading-relaxed overflow-auto max-h-64 whitespace-pre-wrap">
                        {generatedData.prompt}
                      </pre>
                      
                      {/* Copy button overlay */}
                      <motion.button
                        onClick={handleCopyToClipboard}
                        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Copy prompt to clipboard"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="border-t border-white/10 p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    onClick={handleCopyToClipboard}
                    className="btn-primary px-6 py-3 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleDownloadPrompt}
                    className="btn-ghost px-6 py-3 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </motion.button>

                  <motion.button
                    onClick={() => openAITool('https://chatgpt.com', 'ChatGPT')}
                    className="btn-ghost px-6 py-3 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>ChatGPT</span>
                  </motion.button>

                  <motion.button
                    onClick={() => openAITool('https://claude.ai', 'Claude')}
                    className="btn-ghost px-6 py-3 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Claude</span>
                  </motion.button>
                </div>
                
                {/* Usage Tips */}
                <div className="mt-6 p-4 bg-accent-500/5 border border-accent-500/20 rounded-lg">
                  <h5 className="text-sm font-semibold text-accent-400 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Pro Tips
                  </h5>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>• Paste the entire prompt into your AI tool for best results</li>
                    <li>• Ask for clarifications if any part needs more detail</li>
                    <li>• Request specific implementations for complex features</li>
                    <li>• Generate tests and documentation as follow-up prompts</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CodePromptGenerator
