
import { useMemo } from 'react';
import { LiturgyService } from '@/lib/liturgical/services/liturgy-service';
import { useLiturgyPreferences } from './useLiturgyPreferences';

export const useComplineData = (selectedDate: Date) => {
  const { preferences, loading: preferencesLoading } = useLiturgyPreferences();

  const complineData = useMemo(() => {
    try {
      const compline = LiturgyService.getComplineForDate(selectedDate);
      const info = LiturgyService.getComplineInfo(selectedDate, preferences);
      const marianAntiphonId = LiturgyService.getMarianAntiphonPeriod(selectedDate);
      
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
        marian: marianAntiphon
      } : null;

      return {
        compline,
        info,
        renderedComponents,
        loading: false,
        error: null
      };
    } catch (error) {
      console.error('Error loading compline data:', error);
      return {
        compline: null,
        info: null,
        renderedComponents: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [selectedDate, preferences]);

  return {
    ...complineData,
    loading: preferencesLoading || complineData.loading,
    preferencesLoading
  };
};
