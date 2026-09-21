import { supabase } from "@/lib/supabase";
import { CartItem, RawSupabaseCartProduct } from "../types";

export async function getCartedItems(locale: string): Promise<CartItem[]> {
  const stored = localStorage.getItem("cartedProducts");
  if (!stored) return [];

  try {
    const cartedData: { id: number; quantity: number }[] = JSON.parse(stored);
    if (!Array.isArray(cartedData) || cartedData.length === 0) return [];

    const cartedIDs = cartedData.map((item) => item.id);

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        price,
        main_image_url,
        category_id,
        in_stock,
        product_translations:product_translations_product_id_fkey (
          title,
          language_code
        )
        `
      )
      .in("id", cartedIDs)
      .eq("product_translations.language_code", locale);

    if (error || !data) {
      console.error("Error fetching carted products:", error);
      return [];
    }

    return data.map((item: RawSupabaseCartProduct) => {
      const match = cartedData.find((p) => p.id === item.id);
      return {
        id: item.id,
        price: item.price,
        main_image_url: item.main_image_url,
        in_stock: item.in_stock,
        title: item.product_translations?.[0]?.title || "",
        quantity: match?.quantity ?? 1,
      };
    });
  } catch (err) {
    console.error("Failed to parse carted products:", err);
    return [];
  }
}