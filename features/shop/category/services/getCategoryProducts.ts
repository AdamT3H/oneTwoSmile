import { supabase } from "@/lib/supabase";
import { Category, CategoryProductsResult, GetCategoryProductsParams, SupabaseProduct } from "../types";

function getLocalizedCategoryTitle(category: Category, locale: string): string {
    switch (locale) {
      case "pl":
        return category.title_PL || category.title;
      case "en":
        return category.title_ENG || category.title;
      default:
        return category.title;
    }
}

export async function getCategoryProducts({
  category,
  locale,
  page,
  itemsPerPage,
  sortBy,
}: GetCategoryProductsParams): Promise<CategoryProductsResult> {
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("shop_categories")
    .select("*");

  if (categoriesError) {
    console.error("Помилка при завантаженні категорій:", categoriesError.message);
    return { products: [], totalCount: 0, categoryTitle: "", categoryFound: false };
  }

  const currentCategory = categoriesData.find((cat: Category) => cat.name === category);

  if (!currentCategory) {
    return { products: [], totalCount: 0, categoryTitle: "", categoryFound: false };
  }

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let dbQuery = supabase
    .from("products")
    .select(
      `
      id,
      price,
      main_image_url,
      category_id,
      product_translations:product_translations_product_id_fkey!inner (
        title,
        language_code
      )
      `,
      { count: "exact" }
    )
    .eq("category_id", currentCategory.id)
    .eq("product_translations.language_code", locale)
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
    console.error("Помилка при завантаженні товарів:", error.message);
    return { products: [], totalCount: 0, categoryTitle: "", categoryFound: false };
  }

  const products = (data as SupabaseProduct[]).map((item) => ({
    id: item.id,
    price: Number(item.price),
    main_image_url: item.main_image_url,
    title: item.product_translations?.[0]?.title || "",
  }));

  return {
    products,
    totalCount: count ?? 0,
    categoryTitle: getLocalizedCategoryTitle(currentCategory, locale),
    categoryFound: true,
  };
}