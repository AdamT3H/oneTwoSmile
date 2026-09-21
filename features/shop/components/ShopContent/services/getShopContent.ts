import { supabase } from "@/lib/supabase";

interface Product {
    id: number;
    title: string;
    main_image_url: string;
    price: string;
    in_stock: boolean;
    galery_images_url: string[];
    description: string;
    category_id: number;
  }
  
interface RawProduct {
    id: number;
    price: string;
    in_stock: boolean;
    main_image_url: string;
    galery_images_url: string[];
    category_id: number;
    product_translations: {
      title: string;
      description: string;
    }[];
}
  
interface Category {
    id: number;
    name: string;
    title: string;
    title_PL: string;
    title_ENG: string;
}

interface GetShopContentResult {
    categories: Category[];
    productsByCategory: Record<number, Product[]>;
}

export async function getShopContent(
  locale: string,
  noTitle: string
): Promise<GetShopContentResult> {
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("shop_categories")
    .select("*");

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  const categories = categoriesData ?? [];

  const productsFetches = categories.map((category) =>
    supabase
      .from("products")
      .select(
        `
          id,
          price,
          in_stock,
          main_image_url,
          galery_images_url,
          category_id,
          product_translations:product_translations_product_id_fkey!inner (
            title,
            description
          )
        `
      )
      .eq("category_id", category.id)
      .eq("product_translations.language_code", locale)
      .limit(15)
  );

  const productsResults = await Promise.all(productsFetches);

  const productsByCategory: Record<number, Product[]> = {};

  productsResults.forEach((result, index) => {
    if (result.error) {
      throw new Error(result.error.message);
    }

    const categoryId = categories[index].id;

    productsByCategory[categoryId] = (result.data ?? []).map(
      (product: RawProduct) => ({
        id: product.id,
        price: product.price,
        in_stock: product.in_stock,
        main_image_url: product.main_image_url,
        galery_images_url: product.galery_images_url,
        category_id: product.category_id,
        title: product.product_translations?.[0]?.title ?? noTitle,
        description:
          product.product_translations?.[0]?.description ?? "",
      })
    );
  });

  return {
    categories,
    productsByCategory,
  };
}