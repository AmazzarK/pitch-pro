import React, { useState } from 'react'
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
  Zap
} from 'lucide-react'
import { generateCodePrompt } from '../services/api'

/**
 * AI Code Prompt Generator Component
 * Generates comprehensive code prompts that users can use with AI coding tools
 */
const CodePromptGenerator = ({ idea }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  /**
   * Handle prompt generation
   */
  const handleGeneratePrompt = async () => {
    if (!idea || idea.trim().length < 10) {
      setError('Please provide a detailed startup idea first')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedPrompt('')

    try {
      const response = await generateCodePrompt(idea)
      setGeneratedPrompt(response.prompt)
    } catch (err) {
      console.error('Code prompt generation error:', err)
      setError(err.message || 'Failed to generate code prompt')
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Copy prompt to clipboard
   */
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generatedPrompt
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  /**
   * Download prompt as text file
   */
  const handleDownloadPrompt = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedPrompt], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'ai-code-prompt.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.section
      className="py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-4xl">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
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
            Generate a comprehensive prompt for AI coding tools to build your entire MERN stack application
          </p>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleGeneratePrompt}
            disabled={isGenerating || !idea || idea.trim().length < 10}
            className="btn-secondary text-lg py-4 px-8 flex items-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
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
          
          {!idea || idea.trim().length < 10 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-neutral-400 text-sm mt-3"
            >
              💡 Enter your startup idea above first
            </motion.p>
          ) : null}
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

        {/* Generated Prompt Display */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              variants={itemVariants}
              className="space-y-6"
            >
              {/* Action Buttons */}
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
                      <span>Copy to Clipboard</span>
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
                  <span>Download as .txt</span>
                </motion.button>

                <motion.button
                  onClick={() => window.open('https://chat.openai.com', '_blank')}
                  className="btn-ghost px-6 py-3 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Open ChatGPT</span>
                </motion.button>
              </div>

              {/* Prompt Display */}
              <motion.div
                className="glass-card p-6 relative overflow-hidden"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-4 right-4">
                  <Sparkles className="h-5 w-5 text-accent-400 opacity-50" />
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-secondary-400" />
                    Generated Code Prompt
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    Copy this prompt and paste it into your favorite AI coding tool (ChatGPT, Copilot, Cursor, etc.)
                  </p>
                </div>

                <div className="relative">
                  <pre className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 text-neutral-200 text-sm leading-relaxed overflow-auto max-h-96 whitespace-pre-wrap">
                    {generatedPrompt}
                  </pre>
                  
                  {/* Copy button overlay */}
                  <motion.button
                    onClick={handleCopyToClipboard}
                    className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Usage Instructions */}
              <motion.div
                className="glass-card p-6 bg-accent-500/5 border-accent-500/20"
                variants={itemVariants}
              >
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-accent-400" />
                  How to Use This Prompt
                </h4>
                <ol className="text-neutral-300 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Copy the generated prompt using the button above</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Open your preferred AI coding tool (ChatGPT, GitHub Copilot, Cursor, Claude, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Paste the prompt and let the AI generate your complete MERN stack application</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                    <span>Follow the setup instructions provided in the generated code</span>
                  </li>
                </ol>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

export default CodePromptGenerator
