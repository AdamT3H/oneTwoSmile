import { supabase } from "@/lib/supabase";
import { Metadata } from "next";

export async function generateMetadata({
    params,
  }: {
    params: { category: string };
  }): Promise<Metadata> {
    const { category } = params;
  
    const { data: categoriesData, error } = await supabase
      .from("shop_categories")
      .select("*")
      .eq("name", category)
      .single();
  
    if (error || !categoriesData) {
      return {
        title: "Категорія не знайдена",
        description: "Обрана категорія не існує.",
      };
    }
  
    return {
      title: categoriesData.title,
      description: `Перегляньте товари у категорії ${categoriesData.title}`,
      openGraph: {
        title: categoriesData.title,
        description: `Категорія товарів: ${categoriesData.title}`,
        url: `/shop/category/${category}`,
        type: "website",
      },
    };
  }