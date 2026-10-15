import { supabase } from "@/lib/supabase";
import { Service, Category } from "../types";

export default async function getCategories(): Promise<{
  categories: Category[]
}> {
  const { data: categoryData, error: categoryError } = await supabase
    .from("service_categories")
    .select("*");

  if (categoryError) console.error("Помилка при завантаженні категорій:", categoryError);

  return {
    categories: categoryData || [],
  };
}