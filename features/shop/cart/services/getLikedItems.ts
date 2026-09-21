import { supabase } from "@/lib/supabase";
import { LikedProduct, RawLikedProduct } from "../types";

export async function getLikedItems(likedIDs: number[], locale: string): Promise<LikedProduct[]> {
  if (likedIDs.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      main_image_url,
      price,
      in_stock,
      product_translations:product_translations_product_id_fkey (
        title
      )
      `
    )
    .in("id", likedIDs)
    .eq("product_translations.language_code", locale);

  if (error || !data) {
    console.error("Error fetching liked products:", error);
    return [];
  }

  return (data as RawLikedProduct[]).map((item) => ({
    id: item.id,
    main_image_url: item.main_image_url,
    price: item.price,
    title: item.product_translations?.[0]?.title || "",
  }));
}