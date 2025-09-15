import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CodePromptGenerator from '../src/components/CodePromptGenerator'
import * as api from '../src/services/api'

// Mock the API
vi.mock('../src/services/api', () => ({
  generateCodePrompt: vi.fn()
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }) => <div {...props}>{children}</div>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => children
}))

describe('CodePromptGenerator', () => {
  const mockPromptData = {
    success: true,
    data: {
      prompt: 'Test comprehensive development prompt...',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
      fileStructure: {
        'client/': { 'src/': ['components/', 'pages/'] },
        'server/': { 'routes/': ['api.js'] }
      },
      summary: 'A test application summary',
      features: ['User Authentication', 'Data Management'],
      generatedAt: '2025-01-01T00:00:00.000Z'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the main title and description', () => {
      render(<CodePromptGenerator idea="" />)
      
      expect(screen.getByText('AI Code Generator')).toBeInTheDocument()
      expect(screen.getByText(/Generate a comprehensive, actionable prompt/)).toBeInTheDocument()
    })

    it('should render generate button', () => {
      render(<CodePromptGenerator idea="A social media app" />)
      
      expect(screen.getByRole('button', { name: /Generate AI Code Prompt/i })).toBeInTheDocument()
    })

    it('should show validation error for short idea', () => {
      render(<CodePromptGenerator idea="Short" />)
      
      expect(screen.getByText(/Please provide a more detailed description/)).toBeInTheDocument()
    })

    it('should show validation error for empty idea', () => {
      render(<CodePromptGenerator idea="" />)
      
      expect(screen.getByText(/Please provide a valid startup idea/)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should disable generate button for invalid idea', () => {
      render(<CodePromptGenerator idea="Short" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      expect(generateButton).toBeDisabled()
    })

    it('should enable generate button for valid idea', () => {
      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      expect(generateButton).not.toBeDisabled()
    })

    it('should call API when generate button is clicked', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      expect(api.generateCodePrompt).toHaveBeenCalledWith(
        'A comprehensive social media platform for pet owners',
        undefined
      )
    })

    it('should pass pitch data to API when provided', async () => {
      const user = userEvent.setup()
      const pitchData = {
        name: 'PetConnect',
        elevator: 'Connect pet owners worldwide',
        slides: []
      }
      
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A social media platform" pitchData={pitchData} />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      expect(api.generateCodePrompt).toHaveBeenCalledWith(
        'A social media platform',
        pitchData
      )
    })
  })

  describe('Loading States', () => {
    it('should show loading state during generation', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      expect(screen.getByText(/Generating Code Prompt/)).toBeInTheDocument()
      expect(generateButton).toBeDisabled()
    })

    it('should hide loading state after successful generation', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.queryByText(/Generating Code Prompt/)).not.toBeInTheDocument()
      })
      
      expect(generateButton).not.toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockRejectedValue(new Error('API Error'))

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByText(/⚠️ API Error/)).toBeInTheDocument()
      })
    })

    it('should clear error when generating again', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      
      // First click - should show error
      await user.click(generateButton)
      await waitFor(() => {
        expect(screen.getByText(/⚠️ API Error/)).toBeInTheDocument()
      })

      // Second click - should clear error and succeed
      await user.click(generateButton)
      await waitFor(() => {
        expect(screen.queryByText(/⚠️ API Error/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Success Flow', () => {
    it('should show modal after successful generation', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByText('Generated Code Prompt')).toBeInTheDocument()
    })

    it('should display tech stack in modal', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByText('Recommended Tech Stack')).toBeInTheDocument()
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
      })
    })

    it('should display generated prompt in modal', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByText('Test comprehensive development prompt...')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Interactions', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('should close modal when X button is clicked', async () => {
      const user = userEvent.setup()
      
      const closeButton = screen.getByLabelText('Close modal')
      await user.click(closeButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should have copy button in modal', () => {
      expect(screen.getByRole('button', { name: /Copy Prompt/i })).toBeInTheDocument()
    })

    it('should have download button in modal', () => {
      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument()
    })

    it('should have external tool buttons', () => {
      expect(screen.getByRole('button', { name: /ChatGPT/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Claude/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      const user = userEvent.setup()
      api.generateCodePrompt.mockResolvedValue(mockPromptData)

      render(<CodePromptGenerator idea="A comprehensive social media platform for pet owners" />)
      
      const generateButton = screen.getByRole('button', { name: /Generate AI Code Prompt/i })
      await user.click(generateButton)

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveAttribute('aria-labelledby')
        expect(modal).toHaveAttribute('aria-describedby')
      })
    })
  })
})
