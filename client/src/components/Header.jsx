import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Rocket, ArrowRight, Play, Star } from 'lucide-react'

const Header = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-accent-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <Star className="h-4 w-4 text-accent-400" />
              <span className="text-sm font-medium text-neutral-200">
                Trusted by 10,000+ entrepreneurs
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-6"
            >
              <Sparkles className="h-16 w-16 text-primary-400 glow" />
            </motion.div>
            <motion.h1
              className="text-6xl md:text-8xl font-display font-black gradient-text leading-tight"
              variants={itemVariants}
            >
              PitchPerfect
            </motion.h1>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="ml-6"
            >
              <Rocket className="h-16 w-16 text-secondary-400 glow" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-4xl font-display font-semibold text-neutral-100 mb-8 leading-tight"
            variants={itemVariants}
          >
            Transform Ideas Into{' '}
            <span className="gradient-text">Perfect Pitches</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Create compelling company names, elevator pitches, and stunning pitch decks in minutes. 
            Powered by advanced AI, designed for entrepreneurs who demand excellence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            variants={itemVariants}
          >
            <motion.button
              className="btn-primary text-lg px-10 py-5 flex items-center space-x-3 animate-pulse-glow"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5" />
              <span>Start Creating Now</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              className="btn-ghost text-lg px-8 py-4 flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
            variants={itemVariants}
          >
            {[
              { number: '10K+', label: 'Pitches Created' },
              { number: '95%', label: 'Success Rate' },
              { number: '< 2min', label: 'Average Time' },
              { number: '4.9★', label: 'User Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-card p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl md:text-3xl font-display font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Header
