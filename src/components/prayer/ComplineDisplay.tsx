import React, { useMemo } from 'react';
import { LiturgyService } from '@/lib/liturgical/services/liturgy-service';
import { LiturgyComponent } from '@/lib/liturgical/types/liturgy-types';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { useLiturgyPreferences } from '@/hooks/useLiturgyPreferences';
import { cn } from '@/lib/utils';
import { Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiturgyPartProps {
  component: LiturgyComponent;
  preferences: any;
  className?: string;
}

const LiturgyPart: React.FC<LiturgyPartProps> = ({ component, preferences, className }) => {
  if (!component) return null;
  
  const title = component.title ? LiturgyService.renderContent(component.title, preferences) : [];
  const content = LiturgyService.renderContent(component.content, preferences);
  const rubric = component.rubric ? LiturgyService.renderContent(component.rubric, preferences) : [];
  
  const antiphonBefore = component.antiphon?.before ? 
    LiturgyService.renderContent(component.antiphon.before, preferences) : [];
  const antiphonAfter = component.antiphon?.after ? 
    LiturgyService.renderContent(component.antiphon.after, preferences) : [];
  
  const hasAudio = component.audio && component.audio.length > 0;
  const hasChant = component.chant && component.chant.length > 0;
  
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
          {hasChant && (
            <Button size="sm" variant="outline" className="p-1 h-7 w-7">
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
      
      {antiphonBefore.length > 0 && (
        <div className="text-dominican-burgundy mb-2 font-medium">
          {antiphonBefore.map((line, index) => (
            <p key={index}>{line}</p>
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
      
      {antiphonAfter.length > 0 && (
        <div className="text-dominican-burgundy mt-2 font-medium">
          {antiphonAfter.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
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
    
    const renderedComponents = compline ? {
      introduction: compline.components.introduction ? LiturgyService.getComponent(compline.components.introduction) : null,
      hymn: compline.components.hymn ? LiturgyService.getComponent(compline.components.hymn) : null,
      psalmody: compline.components.psalmody?.map(id => LiturgyService.getComponent(id)).filter(Boolean) || [],
      reading: compline.components.reading ? LiturgyService.getComponent(compline.components.reading) : null,
      responsory: compline.components.responsory ? LiturgyService.getComponent(compline.components.responsory) : null,
      canticle: compline.components.canticle ? LiturgyService.getComponent(compline.components.canticle) : null,
      prayer: compline.components.prayer ? LiturgyService.getComponent(compline.components.prayer) : null,
      conclusion: compline.components.conclusion ? LiturgyService.getComponent(compline.components.conclusion) : null,
      marian: compline.components.marian ? LiturgyService.getComponent(compline.components.marian) : null
    } : null;
    
    return { compline, info, renderedComponents };
  }, [selectedDate, preferences]);
  
  if (preferencesLoading || !compline || !renderedComponents) {
    return <div className="text-center py-10">Loading Compline...</div>;
  }
  
  return (
    <div className={cn(`space-y-6 ${info.seasonClass}`, {
      'bg-gray-900 text-white': preferences.useNightMode
    })}>
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
