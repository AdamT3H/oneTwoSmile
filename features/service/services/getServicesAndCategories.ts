import { supabase } from "@/lib/supabase";
import { Service, Category } from "../types";

export async function getServicesAndCategories(): Promise<{
  services: Service[];
  categories: Category[];
}> {
  const { data: serviceData, error: serviceError } = await supabase
    .from("all_services")
    .select("*");

  const { data: categoryData, error: categoryError } = await supabase
    .from("service_categories")
    .select("*");

  if (serviceError) console.error("Помилка при завантаженні послуг:", serviceError);
  if (categoryError) console.error("Помилка при завантаженні категорій:", categoryError);

  return {
    services: serviceData || [],
    categories: categoryData || [],
  };
}