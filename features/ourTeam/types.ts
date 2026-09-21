export type TeamTranslation = {
    name: string;
    position: string[];
    description: string[];
    language_code?: string;
};
  
export type TeamMember = {
    id: number;
    image_url: string;
    translation: TeamTranslation[];
};
  