import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Header from './components/Header'
import IdeaForm from './components/IdeaForm'
import BuildPromptGenerator from './components/BuildPromptGenerator'
import PitchResult from './components/PitchResult'
import LoadingScreen from './components/LoadingScreen'
import ErrorMessage from './components/ErrorMessage'
import { generatePitch } from './services/api'

function App() {
  const [pitchData, setPitchData] = useState(null)
  const [originalIdea, setOriginalIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGeneratePitch = async (idea) => {
    setLoading(true)
    setError(null)
    setPitchData(null)
    setOriginalIdea(idea) // Store the original idea
    
    try {
      const result = await generatePitch(idea)
      setPitchData(result.data)
    } catch (err) {
      setError(err.message)
      console.error('Error generating pitch:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPitchData(null)
    setOriginalIdea('')
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-dark overflow-x-hidden">
      <Navigation />
      
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
        
        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry}
            />
          </motion.div>
        )}
        
        {!pitchData && !loading && !error && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
              {/* Main Pitch Generator */}
              <IdeaForm onSubmit={handleGeneratePitch} />
              
              {/* Quick Build Prompt Generator Section */}
              <div id="quick-build-prompt" className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative">
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Quick AI Code Prompt Generator
                    </h2>
                    <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                      Need a fast developer prompt? Get optimized AI instructions for your startup idea in seconds.
                    </p>
                  </div>
                  <BuildPromptGenerator />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {pitchData && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <PitchResult 
              pitchData={pitchData} 
              originalIdea={originalIdea}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
