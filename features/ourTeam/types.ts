export type TeamTranslation = {
    name: string;
    specialty: string | null;
    education: string | null;
};

export type TreatmentDirection = {
    id: number;
    categoryId: number;
    categoryName: string;
};
  
export type TeamMember = {
    id: number;
    image_url: string;
    experience_years: number | null;
    easyweek_employee_id: string | null;
    translation: TeamTranslation;
    treatmentDirections: TreatmentDirection[];
};