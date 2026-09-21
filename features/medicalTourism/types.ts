export interface TourismOption {
    id: number;
    title: string;
    details: string;
}
  
export interface MedicalTourism {
    id: number;
    name: string;
    price: number;
    duration: string;
    photo: string;
    description?: string;
    options: TourismOption[];
}

export interface MedicalTourismListItem {
    id: number;
    name: string;
    price: number;
    duration: string;
    photo: string;
    description: string;
}
  
export interface FaqItem {
    question: string;
    answer: string;
}
  
export interface TourismTranslation {
    description: string;
    language_code: string;
}
  
export interface TourismOptionTranslation {
    title: string;
    details: string;
    language_code: string;
}
  
export interface TourismOptionRaw {
    id: number;
    medical_tourism_option_translations: TourismOptionTranslation[];
}
  
export interface MedicalTourismRaw {
    id: number;
    name: string;
    price: number;
    duration: string;
    photo: string;
    medical_tourism_translations: TourismTranslation[];
    medical_tourism_options: TourismOptionRaw[];
}

export interface MedicalTourismListRow {
    id: number;
    name: string;
    price: number;
    duration: string;
    photo: string;
    description: string;
    medical_tourism_translations?: TourismTranslation[];
}