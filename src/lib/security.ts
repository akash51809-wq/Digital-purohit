// Rate limiting configuration
export const RATE_LIMITS = {
  CONTACT_FORM: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  },
  UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 uploads per minute
  },
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }
}

// File upload security - Adjusted for Vercel limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: process.env.VERCEL ? 4 * 1024 * 1024 : 10 * 1024 * 1024, // 4MB for Vercel, 10MB for others
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  MAX_FILES_PER_REQUEST: process.env.VERCEL ? 5 : 10 // Reduced for Vercel
}

// Input validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  NAME: /^[a-zA-Z\s\-']{2,50}$/,
  COMPANY: /^[a-zA-Z0-9\s\-&.,]{2,100}$/
}

// Content Security Policy
export const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.cloudinary.com https://*.googleapis.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s+/g, ' ').trim()

// Sanitize HTML input
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// Validate file type
export const isValidFileType = (mimeType: string): boolean => {
  return UPLOAD_LIMITS.ALLOWED_TYPES.includes(mimeType)
}

// Validate file size
export const isValidFileSize = (size: number): boolean => {
  return size <= UPLOAD_LIMITS.MAX_FILE_SIZE
}