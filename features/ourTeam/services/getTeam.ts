import { supabase } from "@/lib/supabase";
import { TeamMember, TeamTranslation } from "../types";

export async function getTeam(locale: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
        .from("team_member")
        .select(`
          id,
          image_url,
          translation:team_member_translation (
            name,
            position,
            description,
            language_code
          )
        `)
        .eq("translation.language_code", locale);

    if (error) {
    console.error("Помилка при завантаженні команди:", error);
    } 
      
    return (data ?? []).map((member) => ({
        id: member.id as number,
        image_url: member.image_url as string,
        translation: member.translation as TeamTranslation[],
    }));
}