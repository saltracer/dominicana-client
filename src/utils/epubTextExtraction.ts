
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

    // Try to get content directly from the rendered iframe first
    let visibleText = '';
    
    try {
      console.log('🔍 EPubExtractor: Attempting to extract from rendered iframe');
      
      // Get the iframe that contains the rendered content
      const iframe = rendition.manager?.views?._views?.[0]?.iframe || 
                    document.querySelector('iframe[src*="blob:"]') ||
                    document.querySelector('iframe');
      
      if (iframe && iframe.contentDocument) {
        const iframeDoc = iframe.contentDocument;
        const iframeBody = iframeDoc.body || iframeDoc.documentElement;
        
        console.log('✅ EPubExtractor: Found iframe document');
        
        // Get the current viewport position within the iframe
        const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop || 0;
        const viewportHeight = iframe.clientHeight || 600;
        
        console.log('📏 EPubExtractor: Viewport info:', {
          scrollTop,
          viewportHeight
        });
        
        // Find all text elements and get those in the visible area
        const textElements = Array.from(iframeDoc.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6'))
          .filter((element: Element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < viewportHeight && rect.bottom > 0;
            const hasText = element.textContent && element.textContent.trim().length > 10;
            return isVisible && hasText;
          })
          .map((element: Element) => element.textContent?.trim() || '')
          .filter(text => {
            // Filter out common Project Gutenberg metadata
            const lowerText = text.toLowerCase();
            return !lowerText.includes('project gutenberg') &&
                   !lowerText.includes('release date') &&
                   !lowerText.includes('author:') &&
                   !lowerText.includes('title:') &&
                   !lowerText.includes('ebook is for') &&
                   !lowerText.includes('***') &&
                   text.length > 20; // Only substantial text
          });
        
        if (textElements.length > 0) {
          // Take the first few visible paragraphs
          visibleText = textElements.slice(0, 5).join(' ');
          console.log('✅ EPubExtractor: Iframe extraction successful:', {
            elementsFound: textElements.length,
            totalLength: visibleText.length,
            preview: visibleText.substring(0, 100) + '...'
          });
        }
      }
    } catch (iframeError) {
      console.warn('⚠️ EPubExtractor: Iframe extraction failed:', iframeError);
    }

    // Fallback: Try CFI-based extraction
    if (!visibleText || visibleText.length < 100) {
      console.log('🔄 EPubExtractor: Falling back to CFI-based extraction');
      
      try {
        // Load the section content
        await currentSection.load(rendition.book.load.bind(rendition.book));
        const sectionDocument = currentSection.document;
        
        if (sectionDocument) {
          console.log('✅ EPubExtractor: Section document loaded');
          
          // Try to find the range for the current CFI
          if (startCfi && rendition.book.canonical) {
            try {
              // Get all text nodes in the section
              const walker = sectionDocument.createTreeWalker(
                sectionDocument.body || sectionDocument.documentElement,
                NodeFilter.SHOW_TEXT,
                {
                  acceptNode: (node: Node) => {
                    const text = node.textContent?.trim() || '';
                    return text.length > 10 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                  }
                }
              );
              
              const textNodes: Node[] = [];
              let node;
              while (node = walker.nextNode()) {
                textNodes.push(node);
              }
              
              console.log('📝 EPubExtractor: Found text nodes:', textNodes.length);
              
              if (textNodes.length > 0) {
                // Take content from multiple text nodes to get a good chunk
                const textChunks = textNodes
                  .slice(0, 10) // Take first 10 text nodes
                  .map(node => node.textContent?.trim() || '')
                  .filter(text => {
                    const lowerText = text.toLowerCase();
                    return !lowerText.includes('project gutenberg') &&
                           !lowerText.includes('release date') &&
                           !lowerText.includes('author:') &&
                           !lowerText.includes('title:') &&
                           !lowerText.includes('ebook is for') &&
                           !lowerText.includes('***') &&
                           text.length > 20;
                  });
                
                if (textChunks.length > 0) {
                  visibleText = textChunks.join(' ');
                  console.log('✅ EPubExtractor: CFI-based extraction successful:', {
                    chunksUsed: textChunks.length,
                    totalLength: visibleText.length
                  });
                }
              }
            } catch (cfiError) {
              console.warn('⚠️ EPubExtractor: CFI extraction failed:', cfiError);
            }
          }
        }
      } catch (sectionError) {
        console.warn('⚠️ EPubExtractor: Section loading failed:', sectionError);
      }
    }

    // Final fallback: Get content from section but skip metadata
    if (!visibleText || visibleText.length < 100) {
      console.log('🔄 EPubExtractor: Final fallback to section content');
      
      try {
        await currentSection.load(rendition.book.load.bind(rendition.book));
        const sectionDocument = currentSection.document;
        
        if (sectionDocument) {
          const body = sectionDocument.body || sectionDocument.documentElement;
          const fullText = body.textContent || '';
          
          console.log('📄 EPubExtractor: Full section text length:', fullText.length);
          
          // Find the start of actual content by looking for common patterns
          const contentMarkers = [
            /ARTICLE\s+\w+/i,
            /QUESTION\s+\w+/i,
            /Chapter\s+\w+/i,
            /Part\s+\w+/i,
            /\*\*\*\s*END OF.*?\*\*\*\s*/i,
            /Reply to Objection/i,
            /Objection \d+/i,
            /I answer that/i,
            /On the contrary/i
          ];
          
          let startPos = 0;
          for (const marker of contentMarkers) {
            const match = fullText.search(marker);
            if (match > 0 && match < fullText.length / 2) { // Don't go too far into the text
              startPos = match;
              console.log('🎯 EPubExtractor: Found content marker at position:', startPos);
              break;
            }
          }
          
          // If no specific marker found, try to skip common header patterns
          if (startPos === 0) {
            const lines = fullText.split('\n');
            let lineIndex = 0;
            
            for (let i = 0; i < Math.min(lines.length, 20); i++) {
              const line = lines[i].trim().toLowerCase();
              if (line.length > 50 && 
                  !line.includes('project gutenberg') &&
                  !line.includes('release date') &&
                  !line.includes('author:') &&
                  !line.includes('title:') &&
                  !line.includes('ebook')) {
                lineIndex = i;
                break;
              }
            }
            
            if (lineIndex > 0) {
              startPos = lines.slice(0, lineIndex).join('\n').length;
              console.log('🎯 EPubExtractor: Skipping header lines, starting at line:', lineIndex);
            }
          }
          
          // Extract a reasonable chunk of text from the determined start position
          const extractLength = Math.min(2000, fullText.length - startPos);
          visibleText = fullText.substring(startPos, startPos + extractLength);
          
          console.log('✅ EPubExtractor: Section fallback extraction:', {
            startPosition: startPos,
            extractedLength: visibleText.length
          });
        }
      } catch (fallbackError) {
        console.error('💥 EPubExtractor: Final fallback failed:', fallbackError);
      }
    }

    // Clean up the extracted text
    visibleText = visibleText
      .replace(/\s+/g, ' ')
      .replace(/Project Gutenberg[^.]*\./gi, '') // Remove Gutenberg references
      .replace(/This ebook is for[^.]*\./gi, '') // Remove ebook notices
      .replace(/Release Date:[^.]*\./gi, '') // Remove release date
      .replace(/Title:[^.]*Author:/gi, '') // Remove title/author lines
      .replace(/\*\*\*[^*]*\*\*\*/g, '') // Remove asterisk sections
      .trim();

    if (!visibleText || visibleText.length < 50) {
      console.error('❌ EPubExtractor: Could not extract meaningful visible text');
      return { text: '' };
    }

    console.log('✅ EPubExtractor: Successfully extracted visible page text:', {
      extractedLength: visibleText.length,
      preview: visibleText.substring(0, 150) + '...'
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
    firstChunkPreview: chunks[0]?.substring(0, 100) + '...'
  });
  
  return chunks;
};
