
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any potential XSS vectors
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed in regular inputs
    ALLOWED_ATTR: []
  });
  
  return sanitized.trim();
};

export const sanitizeRichText = (input: string): string => {
  if (!input) return '';
  
  // Allow basic formatting for rich text fields
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateUserRole = (role: string): boolean => {
  const validRoles = ['free', 'authenticated', 'subscribed', 'admin'];
  return validRoles.includes(role);
};

// Enhanced rate limiting with better tracking
export const rateLimitTracker = new Map<string, { count: number; resetTime: number; firstAttempt: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const entry = rateLimitTracker.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitTracker.set(key, { 
      count: 1, 
      resetTime: now + windowMs,
      firstAttempt: now 
    });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Security utility functions
export const sanitizeFileName = (filename: string): string => {
  // Remove directory traversal attempts and dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.\./g, '')
    .substring(0, 255); // Limit filename length
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

// Input sanitization for SQL injection prevention (additional layer)
export const sanitizeSqlInput = (input: string): string => {
  if (!input) return '';
  
  // Remove SQL injection patterns
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*|\*\//g, '') // Remove block comments
    .trim();
};

// Content Security Policy helpers
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Enhanced logging for security events
export const logSecurityAttempt = (
  type: 'login' | 'signup' | 'role_change' | 'file_upload' | 'admin_action',
  details: Record<string, any>
) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    type,
    timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details
  };
  
  console.log('Security Attempt:', logEntry);
  
  // In production, send to secure logging service
  // await sendToSecurityLog(logEntry);
};
