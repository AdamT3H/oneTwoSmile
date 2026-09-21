export interface Product {
    id: number;
    title: string;
    main_image_url: string;
    price: number;
}
  
export interface SupabaseProduct {
    id: number;
    price: string;
    main_image_url: string;
    category_id: number;
    product_translations?: {
      title: string;
      language_code: string;
    }[];
}
  
export interface Category {
    id: number;
    name: string;
    title: string;
    title_PL: string;
    title_ENG: string;
}
  
export type SortOption = "default" | "price-asc" | "price-desc";
  
export interface GetCategoryProductsParams {
    category: string;
    locale: string;
    page: number;
    itemsPerPage: number;
    sortBy: SortOption;
}
  
export interface CategoryProductsResult {
    products: Product[];
    totalCount: number;
    categoryTitle: string;
    categoryFound: boolean;
}