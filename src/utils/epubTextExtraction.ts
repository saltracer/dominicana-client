
/**
 * Utility functions for extracting text from ePub.js renditions
 * Uses native ePub.js APIs to get only visible page content
 */

export interface TextExtractionResult {
  text: string;
  sectionTitle?: string;
  cfi?: string;
  chapterIndex?: number;
}

export const extractCurrentPageText = async (rendition: any): Promise<TextExtractionResult> => {
  console.log('📖 EPubExtractor: Starting text extraction from current visible page');
  
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

    // Get the current section
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

    // Try to get the range for the current CFI to find the exact visible content
    let visibleText = '';
    
    try {
      // Use ePub.js CFI tools from the book instance
      if (rendition.book.canonical && startCfi) {
        console.log('🎯 EPubExtractor: Attempting CFI-based extraction');
        
        // Get the range from CFI using the book's CFI utilities
        const range = rendition.book.canonical.getRange(startCfi, sectionDocument);
        if (range) {
          console.log('✅ EPubExtractor: Got CFI range, extracting surrounding content');
          
          // Get the container element that contains the range
          let container = range.startContainer;
          while (container && container.nodeType !== Node.ELEMENT_NODE) {
            container = container.parentNode;
          }
          
          if (container) {
            // Get text from the container and several following elements
            const textElements = [];
            let currentElement: Node | null = container;
            let textLength = 0;
            
            // Collect text from current and following elements until we have enough
            while (currentElement && textLength < 2000) {
              if (currentElement.nodeType === Node.ELEMENT_NODE) {
                const element = currentElement as Element;
                if (element.textContent) {
                  const text = element.textContent.trim();
                  if (text.length > 20) { // Skip very short elements
                    textElements.push(text);
                    textLength += text.length;
                  }
                }
              }
              
              // Move to next sibling or parent's next sibling
              currentElement = currentElement.nextSibling || 
                               (currentElement.parentNode?.nextSibling || null);
            }
            
            visibleText = textElements.join(' ');
            console.log('✅ EPubExtractor: CFI-based extraction successful:', {
              elementsFound: textElements.length,
              totalLength: visibleText.length
            });
          }
        }
      }
    } catch (cfiError) {
      console.warn('⚠️ EPubExtractor: CFI extraction failed:', cfiError);
    }

    // Fallback: Try to extract content from the visible viewport
    if (!visibleText || visibleText.length < 100) {
      console.log('🔄 EPubExtractor: Falling back to viewport-based extraction');
      
      try {
        // Get the iframe content
        const iframe = rendition.manager?.views?._views?.[0]?.iframe || 
                      document.querySelector('iframe[src*="blob:"]');
        
        if (iframe && iframe.contentDocument) {
          const iframeDoc = iframe.contentDocument;
          
          // Find all paragraph elements in the iframe
          const paragraphs = Array.from(iframeDoc.querySelectorAll('p, div[class*="para"], div[class*="text"]'));
          console.log('📝 EPubExtractor: Found paragraphs in iframe:', paragraphs.length);
          
          // Get text from first few visible paragraphs
          const visibleParagraphs = paragraphs
            .slice(0, 5) // Take first 5 paragraphs
            .map(p => p.textContent?.trim())
            .filter(text => text && text.length > 20);
          
          if (visibleParagraphs.length > 0) {
            visibleText = visibleParagraphs.join(' ');
            console.log('✅ EPubExtractor: Viewport extraction successful:', {
              paragraphsUsed: visibleParagraphs.length,
              totalLength: visibleText.length
            });
          }
        }
      } catch (viewportError) {
        console.warn('⚠️ EPubExtractor: Viewport extraction failed:', viewportError);
      }
    }

    // Final fallback: Get content from section but try to skip header material
    if (!visibleText || visibleText.length < 100) {
      console.log('🔄 EPubExtractor: Final fallback to section content');
      
      const body = sectionDocument.body || sectionDocument.documentElement;
      if (body) {
        const fullText = body.textContent || '';
        
        // Try to skip Project Gutenberg header and find actual content
        const contentStart = Math.max(
          fullText.indexOf('ARTICLE'),
          fullText.indexOf('QUESTION'),
          fullText.indexOf('Chapter'),
          fullText.indexOf('Part'),
          fullText.indexOf('***'), // Often marks start of content
          0
        );
        
        // If we found a content marker, start from there
        const startPos = contentStart > 0 ? contentStart : 0;
        visibleText = fullText.substring(startPos, Math.min(startPos + 2000, fullText.length));
        
        console.log('✅ EPubExtractor: Section fallback extraction:', {
          fullTextLength: fullText.length,
          startPosition: startPos,
          extractedLength: visibleText.length,
          foundContentMarker: contentStart > 0
        });
      }
    }

    // Clean up the extracted text
    visibleText = visibleText
      .replace(/\s+/g, ' ')
      .replace(/Project Gutenberg[^.]*\./g, '') // Remove Gutenberg references
      .replace(/This ebook is for[^.]*\./g, '') // Remove ebook notices
      .trim();

    if (!visibleText || visibleText.length < 50) {
      console.error('❌ EPubExtractor: Could not extract meaningful visible text');
      return { text: '' };
    }

    console.log('✅ EPubExtractor: Successfully extracted visible page text:', {
      extractedLength: visibleText.length,
      preview: visibleText.substring(0, 100) + '...'
    });

    return {
      text: visibleText,
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
