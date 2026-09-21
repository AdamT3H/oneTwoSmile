import { supabase } from "@/lib/supabase";
import { GetSearchResultsParams, SearchResults, SupabaseProduct } from "../types";

export async function getSearchResults({
  query,
  locale,
  page,
  itemsPerPage,
  sortBy,
}: GetSearchResultsParams): Promise<SearchResults> {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let dbQuery = supabase
    .from("products")
    .select(
      `
      id,
      price,
      main_image_url,
      product_translations:product_translations_product_id_fkey!inner (
        title,
        description,
        language_code
      )
      `,
      { count: "exact" }
    )
    .eq("product_translations.language_code", locale)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`, {
      referencedTable: "product_translations",
    })
    .range(from, to);

  switch (sortBy) {
    case "price-asc":
      dbQuery = dbQuery.order("price", { ascending: true });
      break;
    case "price-desc":
      dbQuery = dbQuery.order("price", { ascending: false });
      break;
  }

  const { data, error, count } = await dbQuery.range(from, to);

  if (error) {
    console.error("Search error:", error.message);
    return { products: [], totalCount: 0 };
  }

  const products = (data as SupabaseProduct[]).map((item) => ({
    id: item.id,
    price: Number(item.price),
    main_image_url: item.main_image_url,
    title: item.product_translations[0]?.title || "",
  }));

  return { products, totalCount: count ?? 0 };
}