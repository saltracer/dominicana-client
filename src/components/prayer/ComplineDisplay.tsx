
import React, { useMemo } from 'react';
import { ComplineService } from '@/lib/liturgical/hours/compline/compline-service';
import { ComplineComponent, ComplineTemplate } from '@/lib/liturgical/hours/hour-types';
import { useLiturgicalDay } from '@/context/LiturgicalDayContext';
import { cn } from '@/lib/utils';

const ComplinePart: React.FC<{
  component: ComplineComponent;
  className?: string;
}> = ({ component, className }) => {
  if (!component) return null;
  
  return (
    <div className={cn("mb-6", className)}>
      {component.title && (
        <h4 className="font-garamond text-xl font-semibold mb-2">{component.title}</h4>
      )}
      
      {component.rubric && (
        <div className="text-sm italic text-gray-600 mb-2">{component.rubric}</div>
      )}
      
      {component.antiphon?.before && (
        <p className="text-dominican-burgundy mb-2">{component.antiphon.before}</p>
      )}
      
      <div className="space-y-2">
        {component.content["en"].map((line, index) => (
          <p key={index} className={line === "" ? "my-2" : ""}>
            {line}
          </p>
        ))}
      </div>
      
      {component.antiphon?.after && (
        <p className="text-dominican-burgundy mt-2">{component.antiphon.after}</p>
      )}
    </div>
  );
};

const ComplineDisplay: React.FC = () => {
  const { selectedDate } = useLiturgicalDay();
  
  const { compline, info } = useMemo(() => {
    const compline = ComplineService.getCompline(selectedDate);
    const info = ComplineService.getComplineInfo(selectedDate);
    return { compline, info };
  }, [selectedDate]);
  
  if (!compline) {
    return <div className="text-center py-10">Loading Compline...</div>;
  }
  
  return (
    <div className={`space-y-6 ${info.seasonClass}`}>
      <div className="mb-6">
        <h3 className="font-garamond text-2xl font-bold text-dominican-burgundy mb-2">
          {info.isOctave ? "Night Prayer - Easter Octave" : compline.title}
        </h3>
        <p className="text-gray-600 mb-2">{info.dateFormatted}</p>
        {info.isOctave && (
          <div className="bg-dominican-gold/20 border-l-4 border-dominican-gold p-3 mb-4">
            During the Octave of Easter, we use the same Night Prayer each day.
          </div>
        )}
      </div>
      
      <ComplinePart component={compline.introduction} className="bg-dominican-light-gray/30 p-4 rounded-md" />
      <ComplinePart component={compline.hymn} />
      
      <div className="space-y-4">
        <h4 className="font-garamond text-xl font-semibold mb-2">Psalmody</h4>
        {compline.psalmody.map((psalm, i) => (
          <ComplinePart key={i} component={psalm} className="bg-dominican-light-gray/20 p-4 rounded-md" />
        ))}
      </div>
      
      <ComplinePart component={compline.reading} />
      <ComplinePart component={compline.responsory} className="font-medium" />
      <ComplinePart component={compline.canticle} className="bg-dominican-light-gray/20 p-4 rounded-md" />
      <ComplinePart component={compline.concludingPrayer} />
      <ComplinePart component={compline.conclusion} />
      
      {compline.marian && (
        <div className="mt-8 pt-4 border-t border-dominican-light-gray">
          <ComplinePart component={compline.marian} />
        </div>
      )}
    </div>
  );
};

export default ComplineDisplay;
