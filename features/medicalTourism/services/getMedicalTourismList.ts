import { supabase } from "@/lib/supabase";
import { MedicalTourismListItem, MedicalTourismListRow } from "../types";

export async function getMedicalTourismList(
  currentLang: string
): Promise<MedicalTourismListItem[]> {
  const { data, error } = await supabase.from("medical_turism").select(
    `
    *,
    medical_tourism_translations:medical_tourism_translations_tourism_id_fkey (
      description,
      language_code
    )
    `
  );

  if (error || !data) {
    console.error(error);
    return [];
  }

  return (data as MedicalTourismListRow[]).map((item) => {
    const translation = item.medical_tourism_translations?.find(
      (tr) => tr.language_code === currentLang
    );

    return {
      id: item.id,
      name: item.name,
      description: translation?.description || item.description,
      duration: item.duration,
      photo: item.photo,
      price: item.price,
    };
  });
}