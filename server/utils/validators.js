/**
 * Input validation utilities for API endpoints
 */

/**
 * Validate code prompt generation input
 * @param {Object} input - Input object to validate
 * @param {string} input.idea - The startup idea description
 * @param {Object} [input.pitchData] - Optional pitch data
 * @returns {Object} Validation result with isValid flag and error details
 */
function validateCodePromptInput({ idea, pitchData }) {
  const errors = [];
  
  // Validate idea
  if (!idea) {
    errors.push('Idea is required');
  } else if (typeof idea !== 'string') {
    errors.push('Idea must be a string');
  } else {
    const trimmedIdea = idea.trim();
    
    if (trimmedIdea.length === 0) {
      errors.push('Idea cannot be empty');
    } else if (trimmedIdea.length < 10) {
      errors.push('Idea must be at least 10 characters long');
    } else if (trimmedIdea.length > 2000) {
      errors.push('Idea must be less than 2000 characters');
    }
    
    // Check for potentially harmful content
    const harmfulPatterns = [
      /script\s*:/i,
      /<script/i,
      /javascript:/i,
      /data:text\/html/i
    ];
    
    if (harmfulPatterns.some(pattern => pattern.test(trimmedIdea))) {
      errors.push('Idea contains potentially harmful content');
    }
  }
  
  // Validate pitch data if provided
  if (pitchData !== null && pitchData !== undefined) {
    if (typeof pitchData !== 'object') {
      errors.push('Pitch data must be an object');
    } else {
      // Validate pitch data structure
      const { name, elevator, slides } = pitchData;
      
      if (name && typeof name !== 'string') {
        errors.push('Pitch name must be a string');
      }
      
      if (elevator && typeof elevator !== 'string') {
        errors.push('Elevator pitch must be a string');
      }
      
      if (slides && !Array.isArray(slides)) {
        errors.push('Slides must be an array');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
    details: errors
  };
}

/**
 * Validate startup idea input for pitch generation
 * @param {string} idea - The startup idea
 * @returns {Object} Validation result
 */
function validateIdeaInput(idea) {
  return validateCodePromptInput({ idea, pitchData: null });
}

/**
 * Sanitize user input by removing potentially harmful content
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/script/gi, 'sc_ript') // Neutralize script tags
    .replace(/javascript:/gi, 'java_script:') // Neutralize javascript: URLs
    .slice(0, 2000); // Limit length
}

/**
 * Validate file upload parameters
 * @param {Object} fileData - File data to validate
 * @returns {Object} Validation result
 */
function validateFileUpload(fileData) {
  const errors = [];
  const { filename, size, type } = fileData;
  
  if (!filename || typeof filename !== 'string') {
    errors.push('Valid filename is required');
  }
  
  if (!size || typeof size !== 'number' || size <= 0) {
    errors.push('Valid file size is required');
  } else if (size > 5 * 1024 * 1024) { // 5MB limit
    errors.push('File size must be less than 5MB');
  }
  
  const allowedTypes = ['text/plain', 'application/json'];
  if (!type || !allowedTypes.includes(type)) {
    errors.push('File type not allowed. Only text and JSON files are accepted.');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
    details: errors
  };
}

module.exports = {
  validateCodePromptInput,
  validateIdeaInput,
  sanitizeInput,
  validateFileUpload
};
