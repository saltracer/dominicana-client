
import React, { useMemo, useState } from 'react';
import { LiturgyService } from '@/lib/liturgical/services/liturgy-service';
import { LiturgyComponent, MultiLanguageContent, LanguageCode } from '@/lib/liturgical/types/liturgy-types';
import ReactMarkdown from 'react-markdown';
import removeMarkdown from 'remove-markdown';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { useLiturgyPreferences } from '@/hooks/useLiturgyPreferences';
import { cn } from '@/lib/utils';
import { Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChantNotationRenderer from './ChantNotationRenderer';

interface LiturgyPartProps {
  component: LiturgyComponent;
  preferences: any;
  className?: string;
}

const LiturgyPart: React.FC<LiturgyPartProps> = ({
  component,
  preferences,
  className
}) => {
  const [showChant, setShowChant] = useState(false);
  if (!component) return null;

  // Get content for both languages
  const primaryLang = preferences.primaryLanguage || 'en';
  const secondaryLang = preferences.secondaryLanguage;
  const showBilingual = preferences.displayMode === 'bilingual' && secondaryLang && secondaryLang !== primaryLang;
  const title = component.title ? LiturgyService.renderContent(component.title, preferences) : [];
  
  // Helper function to safely get content with fallback to empty array
  const getContent = (content: any, lang: string): string[][] => {
    if (!content) return [];
    const result = LiturgyService.renderContentForLanguage(content, lang as LanguageCode);
    return Array.isArray(result) && result.length > 0 ? result : [];
  };

  // Helper function to render content based on chant notation preference
  const processAsterisks = (text: string, isMarkdown: boolean): string => {
    if (!isMarkdown) {
      // Remove asterisks when not using markdown
      let first_text = text.replace(/\*(\s|$)/g, '$1');
      return first_text.replace(/\†(\s|$)/g, '$1');
    }
    return text;
  };
  
  // Then in renderContentLine:
  const renderContentLine = (line: string) => {
    const processedLine = processAsterisks(line, preferences.chantNotationEnabled);
    
    if (preferences.chantNotationEnabled) {
      return (
        <ReactMarkdown
          components={{
            p: ({node, ...props}) => <span {...props} />,
            blockquote: ({node, ...props}) => (
              <blockquote className="pl-4" {...props} />
            )
          }}
        >
          {processedLine}
        </ReactMarkdown>
      );
    } else {
      return removeMarkdown(processedLine);
    }
  };

  // Get content for primary language
  const primaryContent = getContent(component.content, primaryLang);
  
  // Get content for secondary language if needed
  const secondaryContent = showBilingual ? getContent(component.content, secondaryLang) : [];
  
  // Get antiphons for primary language
  const primaryAntiphonBefore = getContent(component.antiphon?.before, primaryLang);
  const primaryAntiphonAfter = getContent(component.antiphon?.after, primaryLang);
  
  // Get antiphons for secondary language if needed
  const secondaryAntiphonBefore = showBilingual ? getContent(component.antiphon?.before, secondaryLang) : [];
  const secondaryAntiphonAfter = showBilingual ? getContent(component.antiphon?.after, secondaryLang) : [];

  // Get rubrics for each language
  const primaryRubric = getContent(component.rubric, primaryLang);
  const secondaryRubric = showBilingual ? getContent(component.rubric, secondaryLang) : [];
  const hasAudio = component.audio && component.audio.length > 0;

  // Get chant content for each language
  const primaryChantContent = component.chant && component.chant[primaryLang] ? component.chant[primaryLang] : null;
  const secondaryChantContent = showBilingual && component.chant && component.chant[secondaryLang] ? component.chant[secondaryLang] : null;
  const handleChantToggle = () => {
    setShowChant(!showChant);
  };

  const renderLanguageColumn = (
    content: string[][], 
    antiphonBefore: string[][], 
    antiphonAfter: string[][], 
    rubric: string[][], 
    langCode: string, 
    langLabel: string, 
    chantContent: any
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {langLabel}
        </h5>
        {chantContent && preferences.chantNotationEnabled && (
          <Button 
            size="sm" 
            variant={showChant ? "default" : "outline"} 
            className="p-1 h-7 w-7"
            onClick={handleChantToggle}
          >
            <Music className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Render rubrics */}
      {rubric.length > 0 && preferences.showRubrics && (
        <div className="liturgy-rubric text-dominican-burgundy mb-4">
          {rubric.map((paragraph, pIndex) => (
            <div key={`rubric-${pIndex}`} className="mb-2">
              {paragraph.map((line, lIndex) => (
                <p key={`rubric-${pIndex}-${lIndex}`}>
                  {renderContentLine(line)}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Render antiphons before */}
      {antiphonBefore.length > 0 && (
        <div className="liturgy-antiphon text-dominican-burgundy mb-4">
          {antiphonBefore.map((paragraph, pIndex) => (
            <div 
              key={`antiphon-before-${pIndex}`} 
              className={cn(
                "mb-2",
                paragraph.some(line => line.startsWith('[')) ? "text-sm text-gray-600 italic" : ""
              )}
            >
              {paragraph.map((line, lIndex) => (
                <p 
                  key={`antiphon-before-${pIndex}-${lIndex}`}
                  className="liturgy-text"
                  style={{
                    fontSize: preferences.fontSize === 'large' ? '1.125rem' : 
                             preferences.fontSize === 'small' ? '0.875rem' : '1rem'
                  }}
                >
                  {renderContentLine(line)}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="space-y-4">
        {content.map((paragraph, pIndex) => (
          <div 
            key={`content-${pIndex}`}
            className={cn(
              paragraph.some(line => line.startsWith('[')) ? "text-sm text-gray-600 italic" : ""
            )}
          >
            {paragraph.map((line, lIndex) => (
              <div
                key={`line-${pIndex}-${lIndex}`}
                className={cn(
                  line === "" ? "my-2" : "", 
                  line.startsWith('[LA]') || line.startsWith('[EN]')
                    ? "text-sm text-gray-600 italic" 
                    : "liturgy-content", 
                  preferences.textSize === "large" ? "text-lg" : "",
                  preferences.textSize === "xlarge" ? "text-xl" : ""
                )}
              >
                {renderContentLine(line)}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Chant notation */}
      {showChant && chantContent && preferences.chantNotationEnabled && (
        <div className="mt-6">
          <ChantNotationRenderer 
            key={chantContent.gregobase_id} 
            gabc={chantContent.data} 
            description={chantContent.description} 
            className="my-4" 
          />
        </div>
      )}
      
      {/* Antiphons after */}
      {antiphonAfter.length > 0 && (
        <div className="liturgy-antiphon text-dominican-burgundy mt-4">
          {antiphonAfter.map((paragraph, pIndex) => (
            <div 
              key={`antiphon-after-${pIndex}`}
              className={cn(
                "mt-2",
                paragraph.some(line => line.startsWith('[')) ? "text-sm text-gray-600 italic" : ""
              )}
            >
              {paragraph.map((line, lIndex) => (
                <p 
                  key={`antiphon-after-${pIndex}-${lIndex}`}
                  className="liturgy-text"
                  style={{
                    fontSize: preferences.fontSize === 'large' ? '1.125rem' : 
                             preferences.fontSize === 'small' ? '0.875rem' : '1rem'
                  }}
                >
                  {renderContentLine(line)}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBilingualContent = (primary: string[][], secondary: string[][]) => {
    if (!showBilingual || secondary.length === 0) {
      return (
        <div className="space-y-4">
          {/* Render primary content only */}
          {primaryRubric.length > 0 && preferences.showRubrics && (
            <div className="liturgy-rubric text-dominican-burgundy mb-4">
              {primaryRubric.map((paragraph, pIndex) => (
                <div key={`rubric-${pIndex}`} className="mb-2">
                  {paragraph.map((line, lIndex) => (
                    <p key={`rubric-${pIndex}-${lIndex}`}>
                      {renderContentLine(line)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Main content */}
          <div className="space-y-4">
            {primary.map((paragraph, pIndex) => (
              <div 
                key={`content-${pIndex}`}
                className={cn(
                  paragraph.some(line => line.startsWith('[')) ? "text-sm text-gray-600 italic" : ""
                )}
              >
                {paragraph.map((line, lIndex) => (
                  <div
                    key={`bilingual-${pIndex}-${lIndex}`}
                    className={cn(
                      line === "" ? "my-2" : "", 
                      line.startsWith('[LA]') || line.startsWith('[EN]')
                        ? "text-sm text-gray-600 italic" 
                        : "liturgy-content", 
                      preferences.textSize === "large" ? "text-lg" : "",
                      preferences.textSize === "xlarge" ? "text-xl" : ""
                    )}
                  >
                    {renderContentLine(line)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Bilingual side-by-side layout
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {renderLanguageColumn(
          primary, 
          primaryAntiphonBefore, 
          primaryAntiphonAfter, 
          primaryRubric, 
          primaryLang, 
          primaryLang === 'en' ? 'English' : primaryLang === 'la' ? 'Latin' : primaryLang.toUpperCase(), 
          primaryChantContent
        )}
        {renderLanguageColumn(
          secondary, 
          secondaryAntiphonBefore, 
          secondaryAntiphonAfter, 
          secondaryRubric, 
          secondaryLang, 
          secondaryLang === 'en' ? 'English' : secondaryLang === 'la' ? 'Latin' : secondaryLang?.toUpperCase(), 
          secondaryChantContent
        )}
      </div>
    );
  };
  
  return <div className={cn("mb-6", className)}>
      {title.length > 0 && <div className="flex items-center gap-2 mb-2">
          <h4 className="text-xl font-semibold">
            {component.type === "hymn" ? "Hymn" : title[0]}
          </h4>
          {hasAudio && preferences.audioEnabled && <Button size="sm" variant="outline" className="p-1 h-7 w-7">
              <Volume2 className="h-3 w-3" />
            </Button>}
          {!showBilingual && (primaryChantContent || secondaryChantContent) && preferences.chantNotationEnabled && <Button size="sm" variant={showChant ? "default" : "outline"} className="p-1 h-7 w-7" onClick={handleChantToggle}>
              <Music className="h-3 w-3" />
            </Button>}
        </div>}
      
      {renderBilingualContent(primaryContent, secondaryContent)}
      
      {!showBilingual && showChant && (primaryChantContent || secondaryChantContent) && preferences.chantNotationEnabled && <div className="mt-4">
          <ChantNotationRenderer key={(primaryChantContent || secondaryChantContent).gregobase_id} gabc={(primaryChantContent || secondaryChantContent).data} description={(primaryChantContent || secondaryChantContent).description} className="mb-4" />
        </div>}

      {component.scriptureRef && <div className="mt-2 text-xs text-gray-500">
          {component.scriptureRef.book} {component.scriptureRef.chapter}:{component.scriptureRef.verse} 
          ({component.scriptureRef.translation})
        </div>}
    </div>;
};

const ComplineDisplay: React.FC = () => {
  const {
    selectedDate
  } = useLiturgicalDay();
  const {
    preferences,
    loading: preferencesLoading
  } = useLiturgyPreferences();
  const {
    compline,
    info,
    renderedComponents
  } = useMemo(() => {
    const compline = LiturgyService.getComplineForDate(selectedDate);
    const info = LiturgyService.getComplineInfo(selectedDate, preferences);
    const marianAntiphonId = LiturgyService.getMarianAntiphonPeriod(selectedDate);
    //console.log("marianAntiphonId", marianAntiphonId);
    // Get the appropriate Marian antiphon component
    const marianAntiphon = LiturgyService.getComponent(marianAntiphonId);
    const renderedComponents = compline ? {
      introduction: compline.components.introduction ? LiturgyService.getComponent(compline.components.introduction) : null,
      examen: compline.components.examen ? LiturgyService.getComponent(compline.components.examen) : null,
      hymn: compline.components.hymn ? LiturgyService.getComponent(compline.components.hymn) : null,
      psalmody: compline.components.psalmody?.map(id => LiturgyService.getComponent(id)).filter(Boolean) || [],
      reading: compline.components.reading ? LiturgyService.getComponent(compline.components.reading) : null,
      responsory: compline.components.responsory ? LiturgyService.getComponent(compline.components.responsory) : null,
      canticle: compline.components.canticle ? LiturgyService.getComponent(compline.components.canticle) : null,
      prayer: compline.components.prayer ? LiturgyService.getComponent(compline.components.prayer) : null,
      conclusion: compline.components.conclusion ? LiturgyService.getComponent(compline.components.conclusion) : null,
      marian: marianAntiphon // Use the dynamically determined Marian antiphon
    } : null;
    return {
      compline,
      info,
      renderedComponents
    };
  }, [selectedDate, preferences]);
  if (preferencesLoading || !compline || !renderedComponents) {
    return <div className="text-center py-10">Loading Compline...</div>;
  }
  return <div className={cn(`space-y-6 ${info.seasonClass}`)}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-dominican-burgundy mb-2">
          {info.title}
        </h3>
        <p className="liturgy-text text-gray-600 mb-2">{info.dateFormatted}</p>
        {info.isOctave && <div className="bg-dominican-gold/20 border-l-4 border-dominican-gold p-3 mb-4">
            <p className="liturgy-text">During the Octave of Easter, we use the same Night Prayer each day.</p>
          </div>}
      </div>
      
      {renderedComponents.introduction && <LiturgyPart component={renderedComponents.introduction} preferences={preferences} className="light:bg-dominican-light-gray/20 rounded-md" />}
      
      {renderedComponents.examen && <LiturgyPart component={renderedComponents.examen} preferences={preferences} />}
      
      {renderedComponents.hymn && <LiturgyPart component={renderedComponents.hymn} preferences={preferences} />}
      
      {renderedComponents.psalmody.length > 0 && <div className="space-y-4">
          <h4 className="text-xl font-semibold mb-2">Psalmody</h4>
          {renderedComponents.psalmody.map((psalm, i) => <LiturgyPart key={i} component={psalm!} preferences={preferences} className="light:bg-dominican-light-gray/20 rounded-md" />)}
        </div>}
      
      {renderedComponents.reading && <LiturgyPart component={renderedComponents.reading} preferences={preferences} />}
      
      {renderedComponents.responsory && <LiturgyPart component={renderedComponents.responsory} preferences={preferences} className="font-medium" />}
      
      {renderedComponents.canticle && <LiturgyPart component={renderedComponents.canticle} preferences={preferences} className="light:bg-dominican-light-gray/20 rounded-md" />}
      
      {renderedComponents.prayer && <LiturgyPart component={renderedComponents.prayer} preferences={preferences} />}
      
      {renderedComponents.conclusion && <LiturgyPart component={renderedComponents.conclusion} preferences={preferences} />}
      
      {renderedComponents.marian && <div className="mt-8 pt-4 border-t border-dominican-light-gray">
          <LiturgyPart component={renderedComponents.marian} preferences={preferences} />
        </div>}
    </div>;
};
export default ComplineDisplay;
