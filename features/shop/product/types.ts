export interface ProductTranslation {
    title: string;
    description: string;
    language_code: string;
}
  
export interface Product {
    id: number;
    title: string;
    main_image_url: string;
    price: string;
    in_stock: boolean;
    galery_images_url: string[];
    description: string;
    product_translations?: ProductTranslation[];
}