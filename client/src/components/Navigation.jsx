import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Menu, X, Rocket, Star, Zap } from 'lucide-react'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Features', href: '#features', icon: Star },
    { name: 'How it works', href: '#how-it-works', icon: Zap },
    { name: 'Pricing', href: '#pricing', icon: Rocket },
  ]

  return (
    <nav className={`nav-sticky transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-primary-400 glow" />
              </motion.div>
            </div>
            <span className="text-2xl font-display font-bold gradient-text">
              PitchPerfect
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors duration-300 group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IconComponent className="h-4 w-4 group-hover:text-primary-400 transition-colors duration-300" />
                  <span className="font-medium">{item.name}</span>
                </motion.a>
              )
            })}
            
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-300 hover:text-primary-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-6 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-neutral-300 hover:text-primary-400 transition-colors duration-300 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              })}
              <button className="btn-primary w-full mt-4">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
