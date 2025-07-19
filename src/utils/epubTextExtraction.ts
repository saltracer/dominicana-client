
/**
 * Utility functions for extracting text from ePub.js renditions
 * Uses native ePub.js APIs instead of DOM scraping
 */

export interface TextExtractionResult {
  text: string;
  sectionTitle?: string;
  cfi?: string;
  chapterIndex?: number;
}

export const extractCurrentPageText = async (rendition: any): Promise<TextExtractionResult> => {
  console.log('📖 EPubExtractor: Starting text extraction from current page');
  
  try {
    if (!rendition || !rendition.book) {
      console.error('❌ EPubExtractor: No valid rendition or book provided');
      return { text: '' };
    }

    // Get current location information
    const currentLocation = rendition.currentLocation();
    console.log('📍 EPubExtractor: Current location:', currentLocation);

    if (!currentLocation || !currentLocation.start) {
      console.warn('⚠️ EPubExtractor: No current location found');
      return { text: '' };
    }

    const startCfi = currentLocation.start.cfi;
    const currentHref = currentLocation.start.href;
    
    console.log('🎯 EPubExtractor: Current position:', {
      cfi: startCfi,
      href: currentHref,
      percentage: currentLocation.start.percentage
    });

    // Find the current section in the book's spine
    const spine = rendition.book.spine;
    const currentSection = spine.get(currentHref);
    
    if (!currentSection) {
      console.error('❌ EPubExtractor: Could not find current section');
      return { text: '' };
    }

    console.log('📄 EPubExtractor: Found current section:', {
      index: currentSection.index,
      href: currentSection.href,
      id: currentSection.id
    });

    // Load the section content
    await currentSection.load(rendition.book.load.bind(rendition.book));
    const sectionDocument = currentSection.document;
    
    if (!sectionDocument) {
      console.error('❌ EPubExtractor: Could not load section document');
      return { text: '' };
    }

    console.log('✅ EPubExtractor: Section document loaded');

    // Extract text from the section
    let sectionText = '';
    
    // Try to get text from body first
    const body = sectionDocument.body || sectionDocument.documentElement;
    if (body) {
      sectionText = body.textContent || body.innerText || '';
    }

    if (!sectionText.trim()) {
      console.warn('⚠️ EPubExtractor: No text found in section body, trying alternative extraction');
      
      // Alternative: get all text elements
      const textElements = sectionDocument.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
      const textParts: string[] = [];
      
      textElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.trim().length > 10) {
          textParts.push(text.trim());
        }
      });
      
      sectionText = textParts.join(' ');
    }

    if (!sectionText.trim()) {
      console.error('❌ EPubExtractor: No text could be extracted from section');
      return { text: '' };
    }

    // Now we need to find the approximate position within the section
    // based on the CFI and current location percentage
    let extractedText = sectionText;
    let startPosition = 0;

    if (currentLocation.start.percentage && currentLocation.start.percentage > 0) {
      // Use percentage to approximate position within the section
      const sectionPercentage = currentLocation.start.percentage;
      startPosition = Math.floor(sectionText.length * sectionPercentage);
      
      console.log('📊 EPubExtractor: Using percentage for positioning:', {
        sectionPercentage,
        sectionLength: sectionText.length,
        startPosition
      });
    }

    // Extract a reasonable "page" of text (approximately 1000-2000 characters)
    const maxPageSize = 2000;
    const endPosition = Math.min(startPosition + maxPageSize, sectionText.length);
    
    // Try to break at sentence boundaries
    let pageText = sectionText.substring(startPosition, endPosition);
    
    // If we're not at the end of the section, try to end at a sentence boundary
    if (endPosition < sectionText.length) {
      const lastSentenceEnd = Math.max(
        pageText.lastIndexOf('.'),
        pageText.lastIndexOf('!'),
        pageText.lastIndexOf('?')
      );
      
      if (lastSentenceEnd > pageText.length * 0.5) {
        pageText = pageText.substring(0, lastSentenceEnd + 1);
      }
    }

    // Clean up the text
    extractedText = pageText
      .replace(/\s+/g, ' ')
      .trim();

    if (extractedText.length < 50) {
      console.warn('⚠️ EPubExtractor: Extracted text too short, using larger chunk');
      // Fallback: take a larger chunk from the beginning of the section
      extractedText = sectionText.substring(0, Math.min(2000, sectionText.length))
        .replace(/\s+/g, ' ')
        .trim();
    }

    console.log('✅ EPubExtractor: Successfully extracted text:', {
      originalSectionLength: sectionText.length,
      extractedLength: extractedText.length,
      startPosition,
      preview: extractedText.substring(0, 100) + '...'
    });

    return {
      text: extractedText,
      sectionTitle: currentSection.id || `Chapter ${currentSection.index + 1}`,
      cfi: startCfi,
      chapterIndex: currentSection.index
    };

  } catch (error) {
    console.error('💥 EPubExtractor: Error during text extraction:', error);
    return { text: '' };
  }
};

export const splitTextIntoChunks = (text: string, chunkSize: number = 1500): string[] => {
  console.log('✂️ EPubExtractor: Splitting text into chunks:', {
    textLength: text.length,
    chunkSize,
    preview: text.substring(0, 50) + '...'
  });
  
  if (!text.trim()) {
    console.warn('⚠️ EPubExtractor: No text to split');
    return [];
  }
  
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  console.log('📝 EPubExtractor: Found sentences:', sentences.length);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim() + '.');
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim() + '.');
  }
  
  console.log('✅ EPubExtractor: Created chunks:', {
    totalChunks: chunks.length,
    averageLength: chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length,
    firstChunkPreview: chunks[0]?.substring(0, 50) + '...'
  });
  
  return chunks;
};
