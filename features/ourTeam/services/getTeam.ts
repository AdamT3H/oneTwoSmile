import { supabase } from "@/lib/supabase";
import { TeamMember, TeamTranslation } from "../types";

interface RawCategory {
  id: number;
  name: string;
  name_ENG: string;
  name_PL: string;
}

function getLocalizedCategoryName(cat: RawCategory | null, locale: string): string {
  if (!cat) return "";
  if (locale === "pl") return cat.name_PL || cat.name;
  if (locale === "en") return cat.name_ENG || cat.name;
  return cat.name;
}

export async function getTeam(locale: string): Promise<TeamMember[]> {
  const { data: members, error: membersError } = await supabase
    .from("team_member")
    .select("id, image_url, experience_years, easyweek_employee_id")

  if (membersError || !members || members.length === 0) {
    if (membersError) console.error("Помилка при завантаженні лікарів:", membersError);
    return [];
  }

  const memberIds = members.map((member) => member.id);

  const { data: translations, error: translationsError } = await supabase
    .from("team_member_translation")
    .select("team_member_id, name, specialty, education")
    .eq("language_code", locale)
    .in("team_member_id", memberIds);

  if (translationsError) {
    console.error("Помилка при завантаженні перекладів:", translationsError);
  }

  const { data: treatmentDirections, error: treatmentDirectionsError } = await supabase
    .from("team_member_treatment_directions")
    .select("id, team_member_id, category_id")
    .in("team_member_id", memberIds);

  if (treatmentDirectionsError) {
    console.error("Помилка при завантаженні напрямів лікування:", treatmentDirectionsError);
  }

  const categoryIds = [...new Set((treatmentDirections ?? []).map((td) => td.category_id))];

  const { data: categories, error: categoriesError } =
    categoryIds.length > 0
      ? await supabase.from("service_categories").select("id, name, name_ENG, name_PL").in("id", categoryIds)
      : { data: [] as RawCategory[], error: null };

  if (categoriesError) {
    console.error("Помилка при завантаженні категорій послуг:", categoriesError);
  }

  return members.map((member) => {
    const translation = (translations ?? []).find((t) => t.team_member_id === member.id);

    const memberDirections = (treatmentDirections ?? [])
      .filter((d) => d.team_member_id === member.id)
      .map((d) => {
        const category = (categories ?? []).find((c) => c.id === d.category_id);
        return {
          id: d.id,
          categoryId: d.category_id,
          categoryName: category ? getLocalizedCategoryName(category, locale) : "",
        };
      });

    return {
      id: member.id,
      image_url: member.image_url,
      experience_years: member.experience_years,
      easyweek_employee_id: member.easyweek_employee_id,
      translation: {
        name: translation?.name ?? "",
        specialty: translation?.specialty ?? null,
        education: translation?.education ?? null,
      },
      treatmentDirections: memberDirections,
    };
  }); 
}