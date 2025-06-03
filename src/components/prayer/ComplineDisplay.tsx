import React, { useMemo, useState } from 'react';
import { LiturgyService } from '@/lib/liturgical/services/liturgy-service';
import { LiturgyComponent } from '@/lib/liturgical/types/liturgy-types';
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

const LiturgyPart: React.FC<LiturgyPartProps> = ({ component, preferences, className }) => {
  const [showChant, setShowChant] = useState(false);
  
  if (!component) return null;
  
  // Get content for both languages
  const primaryLang = preferences.primaryLanguage || 'en';
  const secondaryLang = preferences.secondaryLanguage;
  const showBilingual = preferences.displayMode === 'bilingual' && secondaryLang && secondaryLang !== primaryLang;
  
  const title = component.title ? LiturgyService.renderContent(component.title, preferences) : [];
  const primaryContent = LiturgyService.renderContentForLanguage(component.content, primaryLang);
  const secondaryContent = showBilingual ? LiturgyService.renderContentForLanguage(component.content, secondaryLang) : [];
  const rubric = component.rubric ? LiturgyService.renderContent(component.rubric, preferences) : [];
  
  const primaryAntiphonBefore = component.antiphon?.before ? 
    LiturgyService.renderContentForLanguage(component.antiphon.before, primaryLang) : [];
  const secondaryAntiphonBefore = showBilingual && component.antiphon?.before ? 
    LiturgyService.renderContentForLanguage(component.antiphon.before, secondaryLang) : [];
    
  const primaryAntiphonAfter = component.antiphon?.after ? 
    LiturgyService.renderContentForLanguage(component.antiphon.after, primaryLang) : [];
  const secondaryAntiphonAfter = showBilingual && component.antiphon?.after ? 
    LiturgyService.renderContentForLanguage(component.antiphon.after, secondaryLang) : [];
  
  const hasAudio = component.audio && component.audio.length > 0;
  
  // Get chant content for each language
  const primaryChantContent = component.chant && component.chant[primaryLang] ? component.chant[primaryLang] : null;
  const secondaryChantContent = showBilingual && component.chant && component.chant[secondaryLang] ? component.chant[secondaryLang] : null;

  const handleChantToggle = () => {
    setShowChant(!showChant);
  };

  const renderLanguageColumn = (
    content: string[], 
    antiphonBefore: string[], 
    antiphonAfter: string[], 
    langCode: string,
    langLabel: string,
    chantContent: any
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {langLabel}
        </h5>
        {chantContent && (
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
      
      {antiphonBefore.length > 0 && (
        <div className="text-dominican-burgundy mb-2 font-medium">
          {antiphonBefore.map((line, index) => (
            <p 
              key={index} 
              className={cn(
                line === "" ? "my-2" : "",
                line.startsWith('[LA]') || line.startsWith('[EN]') ? 
                  "text-sm text-gray-600 italic" : ""
              )}
              style={{ fontSize: preferences.fontSize === 'large' ? '1.125rem' : preferences.fontSize === 'small' ? '0.875rem' : '1rem' }}
            >
              {line}
            </p>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        {content.map((line, index) => (
          <p 
            key={index} 
            className={cn(
              line === "" ? "my-2" : "",
              line.startsWith('[LA]') || line.startsWith('[EN]') ? 
                "text-sm text-gray-600 italic" : ""
            )}
            style={{ fontSize: preferences.fontSize === 'large' ? '1.125rem' : preferences.fontSize === 'small' ? '0.875rem' : '1rem' }}
          >
            {line}
          </p>
        ))}
      </div>
      
      {showChant && chantContent && (
        <div className="mt-4">
          <ChantNotationRenderer 
            key={chantContent.gregobase_id}
            gabc={chantContent.data}
            description={chantContent.description}
            className="mb-4"
          />
        </div>
      )}
      
      {antiphonAfter.length > 0 && (
        <div className="text-dominican-burgundy mt-2 font-medium">
          {antiphonAfter.map((line, index) => (
            <p 
              key={index} 
              className={cn(
                line === "" ? "my-2" : "",
                line.startsWith('[LA]') || line.startsWith('[EN]') ? 
                  "text-sm text-gray-600 italic" : ""
              )}
              style={{ fontSize: preferences.fontSize === 'large' ? '1.125rem' : preferences.fontSize === 'small' ? '0.875rem' : '1rem' }}
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderBilingualContent = (primary: string[], secondary: string[]) => {
    if (!showBilingual || secondary.length === 0) {
      return (
        <div className="space-y-2">
          {primary.map((line, index) => (
            <p 
              key={index} 
              className={cn(
                line === "" ? "my-2" : "",
                line.startsWith('[LA]') || line.startsWith('[EN]') ? 
                  "text-sm text-gray-600 italic" : ""
              )}
              style={{ fontSize: preferences.fontSize === 'large' ? '1.125rem' : preferences.fontSize === 'small' ? '0.875rem' : '1rem' }}
            >
              {line}
            </p>
          ))}
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
          primaryLang,
          primaryLang === 'en' ? 'English' : primaryLang === 'la' ? 'Latin' : primaryLang.toUpperCase(),
          primaryChantContent
        )}
        {renderLanguageColumn(
          secondary,
          secondaryAntiphonBefore,
          secondaryAntiphonAfter,
          secondaryLang,
          secondaryLang === 'en' ? 'English' : secondaryLang === 'la' ? 'Latin' : secondaryLang?.toUpperCase(),
          secondaryChantContent
        )}
      </div>
    );
  };
  
  return (
    <div className={cn("mb-6", className)}>
      {title.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-garamond text-xl font-semibold">{title[0]}</h4>
          {hasAudio && preferences.audioEnabled && (
            <Button size="sm" variant="outline" className="p-1 h-7 w-7">
              <Volume2 className="h-3 w-3" />
            </Button>
          )}
          {!showBilingual && (primaryChantContent || secondaryChantContent) && (
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
      )}
      
      {rubric.length > 0 && preferences.showRubrics && (
        <div className="text-sm italic text-gray-600 mb-2">
          {rubric.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      
      {renderBilingualContent(primaryContent, secondaryContent)}
      
      {!showBilingual && showChant && (primaryChantContent || secondaryChantContent) && (
        <div className="mt-4">
          <ChantNotationRenderer 
            key={(primaryChantContent || secondaryChantContent).gregobase_id}
            gabc={(primaryChantContent || secondaryChantContent).data}
            description={(primaryChantContent || secondaryChantContent).description}
            className="mb-4"
          />
        </div>
      )}
      
      {component.scriptureRef && (
        <div className="mt-2 text-xs text-gray-500">
          {component.scriptureRef.book} {component.scriptureRef.chapter}:{component.scriptureRef.verse} 
          ({component.scriptureRef.translation})
        </div>
      )}
    </div>
  );
};

const ComplineDisplay: React.FC = () => {
  const { selectedDate } = useLiturgicalDay();
  const { preferences, loading: preferencesLoading } = useLiturgyPreferences();
    
  const { compline, info, renderedComponents } = useMemo(() => {
    const compline = LiturgyService.getComplineForDate(selectedDate);
    const info = LiturgyService.getComplineInfo(selectedDate, preferences);
    const marianAntiphonId = LiturgyService.getMarianAntiphonPeriod(selectedDate);
    //console.log("marianAntiphonId", marianAntiphonId);
    // Get the appropriate Marian antiphon component
    const marianAntiphon = LiturgyService.getComponent(marianAntiphonId);
    
    const renderedComponents = compline ? {
      introduction: compline.components.introduction ? LiturgyService.getComponent(compline.components.introduction) : null,
      hymn: compline.components.hymn ? LiturgyService.getComponent(compline.components.hymn) : null,
      psalmody: compline.components.psalmody?.map(id => LiturgyService.getComponent(id)).filter(Boolean) || [],
      reading: compline.components.reading ? LiturgyService.getComponent(compline.components.reading) : null,
      responsory: compline.components.responsory ? LiturgyService.getComponent(compline.components.responsory) : null,
      canticle: compline.components.canticle ? LiturgyService.getComponent(compline.components.canticle) : null,
      prayer: compline.components.prayer ? LiturgyService.getComponent(compline.components.prayer) : null,
      conclusion: compline.components.conclusion ? LiturgyService.getComponent(compline.components.conclusion) : null,
      marian: marianAntiphon // Use the dynamically determined Marian antiphon
    } : null;
    
    return { compline, info, renderedComponents };
  }, [selectedDate, preferences]);
  
  if (preferencesLoading || !compline || !renderedComponents) {
    return <div className="text-center py-10">Loading Compline...</div>;
  }
  
  return (
    <div className={cn(`space-y-6 ${info.seasonClass}`)}>
      <div className="mb-6">
        <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
          {info.title}
        </h3>
        <p className="text-gray-600 mb-2">{info.dateFormatted}</p>
        {info.isOctave && (
          <div className="bg-dominican-gold/20 border-l-4 border-dominican-gold p-3 mb-4">
            During the Octave of Easter, we use the same Night Prayer each day.
          </div>
        )}
      </div>
      
      {renderedComponents.introduction && (
        <LiturgyPart 
          component={renderedComponents.introduction} 
          preferences={preferences}
          className="bg-dominican-light-gray/30 p-4 rounded-md" 
        />
      )}
      
      {renderedComponents.hymn && (
        <LiturgyPart 
          component={renderedComponents.hymn} 
          preferences={preferences}
        />
      )}
      
      {renderedComponents.psalmody.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-garamond text-xl font-semibold mb-2">Psalmody</h4>
          {renderedComponents.psalmody.map((psalm, i) => (
            <LiturgyPart 
              key={i} 
              component={psalm!} 
              preferences={preferences}
              className="bg-dominican-light-gray/20 p-4 rounded-md" 
            />
          ))}
        </div>
      )}
      
      {renderedComponents.reading && (
        <LiturgyPart 
          component={renderedComponents.reading} 
          preferences={preferences}
        />
      )}
      
      {renderedComponents.responsory && (
        <LiturgyPart 
          component={renderedComponents.responsory} 
          preferences={preferences}
          className="font-medium" 
        />
      )}
      
      {renderedComponents.canticle && (
        <LiturgyPart 
          component={renderedComponents.canticle} 
          preferences={preferences}
          className="bg-dominican-light-gray/20 p-4 rounded-md" 
        />
      )}
      
      {renderedComponents.prayer && (
        <LiturgyPart 
          component={renderedComponents.prayer} 
          preferences={preferences}
        />
      )}
      
      {renderedComponents.conclusion && (
        <LiturgyPart 
          component={renderedComponents.conclusion} 
          preferences={preferences}
        />
      )}
      
      {renderedComponents.marian && (
        <div className="mt-8 pt-4 border-t border-dominican-light-gray">
          <LiturgyPart 
            component={renderedComponents.marian} 
            preferences={preferences}
          />
        </div>
      )}
    </div>
  );
};

export default ComplineDisplay;
