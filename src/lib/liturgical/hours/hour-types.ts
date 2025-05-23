
export interface ComplineComponent {
  type: string;
  title?: string;
  content: string[];
  rubric?: string;
  antiphon?: {
    before?: string;
    after?: string;
  };
}

export interface ComplineTemplate {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  title: string;
  introduction: ComplineComponent;
  hymn: ComplineComponent;
  psalmody: ComplineComponent[];
  reading: ComplineComponent;
  responsory: ComplineComponent;
  canticle: ComplineComponent;
  concludingPrayer: ComplineComponent;
  conclusion: ComplineComponent;
  marian?: ComplineComponent;
}