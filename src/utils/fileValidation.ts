
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFileType = (file: File, allowedTypes: string[]): FileValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
};

export const validateFileSize = (file: File, maxSizeBytes: number): FileValidationResult => {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  
  return { valid: true };
};

export const validateFileName = (fileName: string): FileValidationResult => {
  // Check for dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.jar'];
  const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  if (dangerousExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File extension ${fileExtension} is not allowed for security reasons`
    };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains invalid characters'
    };
  }
  
  return { valid: true };
};

export const validateImageFile = (file: File): FileValidationResult => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  let result = validateFileType(file, allowedTypes);
  if (!result.valid) return result;
  
  result = validateFileSize(file, maxSize);
  if (!result.valid) return result;
  
  return validateFileName(file.name);
};

export const validateEpubFile = (file: File): FileValidationResult => {
  const allowedTypes = ['application/epub+zip'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  let result = validateFileType(file, allowedTypes);
  if (!result.valid) return result;
  
  result = validateFileSize(file, maxSize);
  if (!result.valid) return result;
  
  return validateFileName(file.name);
};
