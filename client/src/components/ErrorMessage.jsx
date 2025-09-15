import React from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  RefreshCcw, 
  MessageCircle, 
  Zap, 
  Wifi, 
  Settings, 
  FileText,
  ArrowRight,
  Coffee,
  Heart
} from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => {
  const troubleshootingTips = [
    {
      icon: Wifi,
      title: "Check Connection",
      description: "Ensure you have a stable internet connection"
    },
    {
      icon: Settings,
      title: "Server Status",
      description: "Verify the development server is running"
    },
    {
      icon: Zap,
      title: "API Configuration",
      description: "Check if OpenAI API key is valid and has credits"
    },
    {
      icon: FileText,
      title: "Input Length",
      description: "Try with a shorter, more concise description"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          {/* Error Icon */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-red-500/20 glow"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Error Title */}
          <motion.div
            variants={itemVariants}
            className="mb-6 relative z-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
              Oops! Hit a Snag
            </h1>
            <p className="text-lg text-neutral-300">
              Don't worry - even the best rockets need a second launch 🚀
            </p>
          </motion.div>

          {/* Error Message */}
          <motion.div
            variants={itemVariants}
            className="mb-8 relative z-10"
          >
            <div className="glass-card p-6 bg-red-500/5 border-red-500/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-neutral-200 text-left font-medium leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            variants={itemVariants}
            className="mb-8 relative z-10"
          >
            <motion.button
              onClick={onRetry}
              className="btn-primary text-lg py-4 px-8 flex items-center space-x-3 animate-pulse-glow mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCcw className="h-5 w-5" />
              <span>Try Again</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Troubleshooting Section */}
          <motion.div
            variants={itemVariants}
            className="relative z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="h-5 w-5 text-neutral-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Quick Troubleshooting
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {troubleshootingTips.map((tip, index) => {
                const Icon = tip.icon
                return (
                  <motion.div
                    key={index}
                    className="glass-card p-4 text-left hover:border-primary-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    variants={itemVariants}
                    custom={index}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Encouraging message */}
            <motion.div
              className="glass-card p-4 bg-accent-500/5 border-accent-500/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-center space-x-2 text-accent-400">
                <Coffee className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Pro tip: Great ideas are worth the wait! 
                </span>
                <Heart className="h-4 w-4 text-red-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ErrorMessage
