import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BuildPromptGenerator from '../components/BuildPromptGenerator'
import * as api from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  generateBuildPrompt: vi.fn()
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    textarea: ({ children, ...props }) => <textarea {...props}>{children}</textarea>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

describe('BuildPromptGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component correctly', () => {
    render(<BuildPromptGenerator />)
    
    expect(screen.getByText('⚡ Quick Build Prompt')).toBeInTheDocument()
    expect(screen.getByText('Fast AI prompt generation for developers')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/food delivery app/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Generate Quick Prompt/i })).toBeInTheDocument()
  })

  it('shows character counter correctly', () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const testIdea = 'Test startup idea'
    
    fireEvent.change(textarea, { target: { value: testIdea } })
    
    expect(screen.getByText(`${500 - testIdea.length} / 500`)).toBeInTheDocument()
  })

  it('shows character limit warning when near limit', () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const longIdea = 'a'.repeat(470) // Near the 500 limit
    
    fireEvent.change(textarea, { target: { value: longIdea } })
    
    const counter = screen.getByText('30 / 500')
    expect(counter).toHaveClass('bg-yellow-100', 'text-yellow-700')
  })

  it('shows character limit error when over limit', () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const tooLongIdea = 'a'.repeat(520) // Over the 500 limit
    
    fireEvent.change(textarea, { target: { value: tooLongIdea } })
    
    const counter = screen.getByText('-20 / 500')
    expect(counter).toHaveClass('bg-red-100', 'text-red-700')
    expect(textarea).toHaveClass('border-red-500')
  })

  it('disables submit button when input is too long', () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const submitButton = screen.getByRole('button', { name: /Generate Quick Prompt/i })
    const tooLongIdea = 'a'.repeat(520)
    
    fireEvent.change(textarea, { target: { value: tooLongIdea } })
    
    expect(submitButton).toBeDisabled()
  })

  it('successfully generates build prompt', async () => {
    const mockPrompt = 'Build a React app with Express backend...'
    api.generateBuildPrompt.mockResolvedValueOnce({
      success: true,
      data: { prompt: mockPrompt }
    })

    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const submitButton = screen.getByRole('button', { name: /Generate Quick Prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Food delivery app for healthy meals' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Quick Build Prompt')).toBeInTheDocument()
      expect(screen.getByText(mockPrompt)).toBeInTheDocument()
    })
    
    expect(api.generateBuildPrompt).toHaveBeenCalledWith('Food delivery app for healthy meals')
  })

  it('handles API errors correctly', async () => {
    const errorMessage = 'Failed to generate prompt'
    api.generateBuildPrompt.mockRejectedValueOnce(new Error(errorMessage))

    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const submitButton = screen.getByRole('button', { name: /Generate Quick Prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Valid startup idea' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('validates minimum input length', () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const submitButton = screen.getByRole('button', { name: /Generate Quick Prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Short' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText(/Please provide more details/i)).toBeInTheDocument()
  })

  it('copies prompt to clipboard successfully', async () => {
    const mockPrompt = 'Test build prompt content'
    api.generateBuildPrompt.mockResolvedValueOnce({
      success: true,
      data: { prompt: mockPrompt }
    })

    // Mock clipboard API
    const mockWriteText = vi.fn().mockResolvedValueOnce()
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    })

    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const submitButton = screen.getByRole('button', { name: /Generate Quick Prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Food delivery app for healthy meals' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(mockPrompt)).toBeInTheDocument()
    })
    
    const copyButton = screen.getByRole('button', { name: /Copy/i })
    fireEvent.click(copyButton)
    
    expect(mockWriteText).toHaveBeenCalledWith(mockPrompt)
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })
  })

  it('clears form and results when clear button is clicked', async () => {
    render(<BuildPromptGenerator />)
    
    const textarea = screen.getByPlaceholderText(/food delivery app/i)
    const testIdea = 'Test startup idea'
    
    fireEvent.change(textarea, { target: { value: testIdea } })
    
    expect(textarea.value).toBe(testIdea)
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearButton)
    
    expect(textarea.value).toBe('')
  })

  it('shows helpful info text', () => {
    render(<BuildPromptGenerator />)
    
    expect(screen.getByText(/Shorter descriptions = faster AI responses/i)).toBeInTheDocument()
    expect(screen.getByText(/Use this prompt with your favorite AI coding assistant/i)).toBeInTheDocument()
  })
})
