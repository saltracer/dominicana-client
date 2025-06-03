
// // Basic liturgical component interface
// export interface LiturgyComponent {
//   id: string;
//   type: string;
//   title?: string;
//   content?: string;
//   latin?: string;
//   english?: string;
//   antiphon?: string;
//   verse?: string;
//   response?: string;
//   notation?: string;
//   audio_url?: string;
//   order?: number;
// }

// // Compline-specific types
// export interface ComplineComponent extends LiturgyComponent {
//   type: 'opening' | 'hymn' | 'psalm' | 'canticle' | 'prayer' | 'antiphon' | 'responsory' | 'conclusion';
// }

// export interface ComplineTemplate {
//   id: string;
//   name: string;
//   day_of_week: string;
//   components: ComplineComponent[];
//   season?: string;
//   rank?: string;
// }

// // General hour types
// export interface HourTemplate {
//   id: string;
//   name: string;
//   type: 'compline' | 'lauds' | 'vespers' | 'terce' | 'sext' | 'none' | 'matins';
//   components: LiturgyComponent[];
// }
