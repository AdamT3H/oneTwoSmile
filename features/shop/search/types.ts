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
    product_translations: {
      title: string;
      description: string;
      language_code: string;
    }[];
}

export interface GetSearchResultsParams {
    query: string;
    locale: string;
    page: number;
    itemsPerPage: number;
    sortBy: SortOption;
}
  
export interface SearchResults {
    products: Product[];
    totalCount: number;
}
  
export type SortOption = "default" | "price-asc" | "price-desc";