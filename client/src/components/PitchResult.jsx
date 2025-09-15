import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RotateCcw, 
  Building, 
  MessageSquare, 
  Presentation,
  FileImage,
  ExternalLink,
  Trophy,
  Crown,
  Sparkles,
  Eye,
  Maximize2,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import { generatePDF, downloadSlidesAsImages } from '../services/pdf'
import CodePromptGenerator from './CodePromptGenerator'

const PitchResult = ({ pitchData, originalIdea, onReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSlidePreview, setShowSlidePreview] = useState(false)
  const [downloadType, setDownloadType] = useState('')
  const [copied, setCopied] = useState(false)

  const { name, elevator, slides } = pitchData

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => prev === 0 ? slides.length - 1 : prev - 1)
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => prev === slides.length - 1 ? 0 : prev + 1)
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setDownloadType('pdf')
    try {
      await generatePDF(slides, name)
    } catch (error) {
      alert(`Failed to generate PDF: ${error.message}`)
    } finally {
      setIsDownloading(false)
      setDownloadType('')
    }
  }

  const handleDownloadImages = async () => {
    setIsDownloading(true)
    setDownloadType('images')
    try {
      await downloadSlidesAsImages(slides, name)
    } catch (error) {
      alert(`Failed to generate images: ${error.message}`)
    } finally {
      setIsDownloading(false)
      setDownloadType('')
    }
  }

  const handleCopyElevatorPitch = async () => {
    try {
      await navigator.clipboard.writeText(elevator)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

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
      className="py-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-6xl space-y-12">
        
        {/* Success celebration header */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl mb-6 glow-intense"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4"
            variants={itemVariants}
          >
            🎉 Your Perfect Pitch is Ready!
          </motion.h1>
          
          <motion.p
            className="text-lg text-neutral-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Your startup vision has been transformed into a professional presentation. 
            Review, download, and start impressing investors!
          </motion.p>
        </motion.div>

        {/* Company name and elevator pitch showcase */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-3xl blur-xl"></div>
          <div className="relative glass-card p-8 md:p-12 border border-primary-500/20">
            
            {/* Company Name Section */}
            <motion.div
              className="text-center mb-12"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="h-12 w-12 text-accent-400 mr-4 glow" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-display font-black gradient-text">
                  {name}
                </h1>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Building className="h-12 w-12 text-primary-400 ml-4 glow" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Elevator Pitch Section */}
            <motion.div
              className="max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-8 w-8 text-secondary-400 glow" />
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Elevator Pitch
                  </h2>
                </div>
                <motion.button
                  onClick={handleCopyElevatorPitch}
                  className="btn-ghost px-4 py-2 text-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              
              <motion.div
                className="relative p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-4 left-4">
                  <Sparkles className="h-6 w-6 text-accent-400 opacity-50" />
                </div>
                <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-medium italic">
                  "{elevator}"
                </p>
                <div className="absolute bottom-4 right-4">
                  <Sparkles className="h-6 w-6 text-primary-400 opacity-50" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Pitch Deck Section */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-3xl blur-xl"></div>
          <div className="relative glass-card p-6 md:p-8 border border-secondary-500/20">
            
            {/* Deck Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Pitch Deck
                  </h2>
                  <p className="text-neutral-400">
                    Slide {currentSlide + 1} of {slides.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setShowSlidePreview(true)}
                  className="btn-ghost px-4 py-2 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Maximize2 className="h-4 w-4" />
                  <span>Fullscreen</span>
                </motion.button>
                <motion.button
                  className="btn-ghost px-4 py-2 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center space-x-6 mb-8">
              <motion.button
                onClick={handlePrevSlide}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </motion.button>
              
              <div className="flex-1 flex space-x-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={handleNextSlide}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            {/* Slide Display */}
            <motion.div 
              className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/5"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
                    className="w-full h-full slide-content"
                    style={{ 
                      transform: 'scale(0.5)',
                      transformOrigin: 'top left',
                      width: '200%',
                      height: '200%'
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Slide preview overlay button */}
              <motion.button
                onClick={() => setShowSlidePreview(true)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="h-5 w-5 text-white" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn-primary text-lg py-4 px-8 flex items-center space-x-3 animate-pulse-glow min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDownloading && downloadType === 'pdf' ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleDownloadImages}
            disabled={isDownloading}
            className="btn-secondary text-lg py-4 px-8 flex items-center space-x-3 min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDownloading && downloadType === 'images' ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Generating Images...</span>
              </>
            ) : (
              <>
                <FileImage className="h-5 w-5" />
                <span>Download Images</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={onReset}
            className="btn-ghost text-lg py-4 px-8 flex items-center space-x-3 min-w-[200px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="h-5 w-5" />
            <span>Create New Pitch</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Fullscreen Slide Preview Modal */}
      <AnimatePresence>
        {showSlidePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowSlidePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl aspect-video bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
                className="w-full h-full slide-content"
              />
              
              {/* Close button */}
              <motion.button
                onClick={() => setShowSlidePreview(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="h-6 w-6 text-white transform rotate-45" />
              </motion.button>
              
              {/* Navigation in fullscreen */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <motion.button
                  onClick={handlePrevSlide}
                  className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </motion.button>
                
                <div className="text-white font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                  {currentSlide + 1} / {slides.length}
                </div>
                
                <motion.button
                  onClick={handleNextSlide}
                  className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced AI Code Generator */}
      <CodePromptGenerator idea={originalIdea} pitchData={pitchData} />
    </motion.div>
  )
}

export default PitchResult
