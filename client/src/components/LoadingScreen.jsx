import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles, Zap, Rocket, Brain, Lightbulb, Target, TrendingUp } from 'lucide-react'

const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingSteps = [
    { 
      icon: Brain, 
      text: "Analyzing your brilliant idea", 
      subtext: "Understanding market potential & unique value",
      delay: 0,
      color: "from-primary-500 to-primary-400"
    },
    { 
      icon: Lightbulb, 
      text: "Generating perfect company name", 
      subtext: "Creating memorable, brandable identity",
      delay: 1,
      color: "from-accent-500 to-accent-400"
    },
    { 
      icon: Target, 
      text: "Crafting compelling elevator pitch", 
      subtext: "Distilling essence into powerful message",
      delay: 2,
      color: "from-secondary-500 to-secondary-400"
    },
    { 
      icon: TrendingUp, 
      text: "Designing stunning pitch deck", 
      subtext: "Building investor-ready presentation",
      delay: 3,
      color: "from-primary-500 to-secondary-500"
    },
  ]

  const motivationalQuotes = [
    "Every great startup began with a single idea ✨",
    "Your vision is becoming reality 🚀",
    "Building the future, one pitch at a time 💡",
    "Transforming ideas into opportunities 🎯",
    "Creating magic with artificial intelligence ⚡"
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 4000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 101)
    }, 200)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 3000)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearInterval(quoteInterval)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-accent-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-12 max-w-2xl mx-auto">
        
        {/* Main loading animation */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          {/* Outer spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 border-4 border-primary-500/20 border-t-primary-500 rounded-full relative"
          >
            <div className="absolute top-0 right-0 w-4 h-4 bg-primary-500 rounded-full glow"></div>
          </motion.div>
          
          {/* Middle spinning ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 left-4 w-32 h-32 border-4 border-secondary-500/20 border-b-secondary-500 rounded-full"
          >
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-secondary-500 rounded-full glow"></div>
          </motion.div>

          {/* Inner pulsing ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-8 w-24 h-24 border-2 border-accent-500/30 rounded-full"
          />
          
          {/* Center icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center glow-intense"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Bot className="h-8 w-8 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main title */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-display font-bold gradient-text"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AI is Creating Magic ✨
          </motion.h1>
          
          <motion.div
            className="text-lg text-neutral-300 font-medium"
            key={currentQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {motivationalQuotes[currentQuote]}
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-md"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-neutral-300">Progress</span>
              <span className="text-sm font-bold text-primary-400">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full"
                style={{ width: `${progress}%` }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading steps */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-lg space-y-4"
        >
          {loadingSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <motion.div
                key={index}
                className={`glass-card p-4 transition-all duration-500 ${
                  isActive 
                    ? 'border-primary-500/50 bg-primary-500/5' 
                    : isCompleted
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-white/10'
                }`}
                animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.color}`}
                    animate={isActive ? { 
                      scale: [1, 1.1, 1],
                      rotateY: [0, 180, 360]
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: isActive ? Infinity : 0
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className={`font-semibold ${
                        isActive 
                          ? 'text-white' 
                          : isCompleted
                          ? 'text-green-400'
                          : 'text-neutral-300'
                      }`}
                      animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                    >
                      {step.text}
                    </motion.div>
                    <div className={`text-sm ${
                      isActive 
                        ? 'text-neutral-200' 
                        : 'text-neutral-400'
                    }`}>
                      {step.subtext}
                    </div>
                  </div>
                  
                  <motion.div
                    className="flex-shrink-0"
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  >
                    {isCompleted ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      </div>
                    ) : isActive ? (
                      <motion.div
                        className="w-6 h-6 border-2 border-primary-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-neutral-600 rounded-full"></div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Fun loading message */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="glass-card p-4"
          >
            <p className="text-neutral-300 text-sm leading-relaxed">
              🎯 <strong>Pro Tip:</strong> This usually takes 15-45 seconds. We're crafting something extraordinary that will impress investors and capture your vision perfectly!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
