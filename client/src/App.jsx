import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Header from './components/Header'
import IdeaForm from './components/IdeaForm'
import PitchResult from './components/PitchResult'
import LoadingScreen from './components/LoadingScreen'
import ErrorMessage from './components/ErrorMessage'
import { generatePitch } from './services/api'

function App() {
  const [pitchData, setPitchData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGeneratePitch = async (idea) => {
    setLoading(true)
    setError(null)
    setPitchData(null)
    
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
            <IdeaForm onSubmit={handleGeneratePitch} />
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
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
