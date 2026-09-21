import { supabase } from "@/lib/supabase";
import { Product, ProductTranslation } from "../types";

export async function getProductById(id: string, currentLang: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        product_translations:product_translations_product_id_fkey (
          title,
          description,
          language_code
        )
      `
    )
    .eq("id", Number(id))
    .single();

    if (error || !data) {
      console.error("Помилка при завантаженні товару:", error);
      return null;
    }

    const translation = data.product_translations?.find(
      (tr: ProductTranslation) => tr.language_code === currentLang
    );

    return {
      ...data,
      title: translation?.title || data.title,
      description: translation?.description || data.description,
    };
  };