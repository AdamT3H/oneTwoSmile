// ./app/product/[id]/metadata.ts
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data: product, error } = await supabase
    .from("products")
    .select("title, description, main_image_url")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return {
      title: "Товар не знайдено",
      description: "Цей товар не знайдено на нашому сайті.",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.main_image_url }],
    },
  };
}
