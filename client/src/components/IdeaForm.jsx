import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Lightbulb, Sparkles, Rocket, ArrowRight, Zap, TrendingUp, Users, Target } from 'lucide-react'
import CodePromptGenerator from './CodePromptGenerator'

const IdeaForm = ({ onSubmit }) => {
  const [idea, setIdea] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      return
    }

    if (idea.trim().length < 10) {
      alert('Please provide a more detailed description (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(idea)
    } finally {
      setIsSubmitting(false)
    }
  }

  const exampleIdeas = [
    {
      title: "AI-Powered Meal Planning",
      description: "An AI meal planning app creating personalized weekly menus based on dietary restrictions, budget, and local grocery store availability.",
      icon: Target,
      category: "HealthTech"
    },
    {
      title: "Urban Parking Marketplace",
      description: "A peer-to-peer marketplace for renting unused parking spaces in urban areas, helping property owners monetize empty spots.",
      icon: TrendingUp,
      category: "PropTech"
    },
    {
      title: "VR Team Building Platform",
      description: "A virtual reality platform for remote team building activities that helps distributed teams bond through immersive experiences.",
      icon: Users,
      category: "WorkTech"
    },
    {
      title: "Smart Plant Care System",
      description: "An automated plant care system with IoT sensors that monitors and waters houseplants based on their specific needs.",
      icon: Lightbulb,
      category: "IoT"
    }
  ]

  const handleExampleClick = (exampleDescription) => {
    setIdea(exampleDescription)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <motion.section
      className="py-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mr-4"
            >
              <Rocket className="h-12 w-12 text-primary-400 glow" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
              Describe Your Vision
            </h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="ml-4"
            >
              <Sparkles className="h-12 w-12 text-accent-400 glow" />
            </motion.div>
          </div>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Share your startup idea with us and watch it transform into a 
            <span className="gradient-text font-semibold"> professional pitch presentation</span>
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-8 md:p-12 mb-12"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="relative">
                <motion.div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    focusedField === 'idea' 
                      ? 'bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 blur-xl' 
                      : 'bg-transparent'
                  }`}
                  animate={focusedField === 'idea' ? { scale: 1.02 } : { scale: 1 }}
                />
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onFocus={() => setFocusedField('idea')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Share your startup vision... What problem does it solve? Who's your target audience? What makes it revolutionary?"
                  className="relative w-full h-48 px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 resize-none backdrop-blur-xl transition-all duration-300 text-lg leading-relaxed"
                  disabled={isSubmitting}
                  maxLength={2000}
                />
                <div className="absolute bottom-4 right-6 text-neutral-500 text-sm font-medium">
                  <span className={idea.length > 1800 ? 'text-accent-400' : ''}>{idea.length}</span>/2000
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={!idea.trim() || idea.trim().length < 10 || isSubmitting}
                className="w-full btn-primary text-xl py-6 px-8 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Creating Your Perfect Pitch...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6" />
                    <span>Generate Perfect Pitch</span>
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </motion.button>

              {idea.trim().length > 0 && idea.trim().length < 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl"
                >
                  <p className="text-accent-400 text-sm text-center font-medium">
                    💡 Please provide more details about your idea (at least 10 characters)
                  </p>
                </motion.div>
              )}
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          className="mt-16"
          variants={itemVariants}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-semibold text-white mb-4 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-accent-400 mr-3 glow" />
              Need Inspiration? Try These Successful Ideas
            </h3>
            <p className="text-neutral-400">
              Click any example below to see how it transforms into a pitch
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {exampleIdeas.map((example, index) => {
              const Icon = example.icon
              return (
                <motion.button
                  key={index}
                  onClick={() => handleExampleClick(example.description)}
                  className="group glass-card p-6 text-left hover:border-primary-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-semibold text-white group-hover:gradient-text transition-all duration-300">
                          {example.title}
                        </h4>
                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full font-medium">
                          {example.category}
                        </span>
                      </div>
                      <p className="text-neutral-300 group-hover:text-neutral-200 transition-colors duration-300 text-sm leading-relaxed">
                        {example.description}
                      </p>
                      <div className="flex items-center mt-3 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span>Try this example</span>
                        <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
        
        {/* AI Code Prompt Generator Section */}
        <CodePromptGenerator idea={idea} />
      </div>
    </motion.section>
  )
}

export default IdeaForm
