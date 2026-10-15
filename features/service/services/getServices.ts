import { supabase } from "@/lib/supabase";
import { Service } from "../types";

export default async function getServices(
  category: number | null
): Promise<{
  services: Service[]
}> {
  let query = supabase.from("all_services").select("*");

  if(category !== null) {
    query = query.eq("category_id", category)
  }


  const { data, error } = await query;

  if (error) {
    console.error("Помилка при завантаженні послуг:", error);
    throw error;
  }

  return { services: data ?? [] };
}