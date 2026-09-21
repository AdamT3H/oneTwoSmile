export interface ProductPay {
    name: string;
    count: number;
    price: number;
    id: number;
    inStock: boolean;
}
  
export interface OrderData {
    totalPrice: number;
    items: ProductPay[];
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    paymentType: string;
    comment: string;
    email: string;
    deliveryType: string;
    oblastName?: string | null;
    selectedCity?: { label: string } | null;
    selectedWarehouse?: { label: string } | null;
}

export interface CartItem {
    id: number;
    title: string;
    main_image_url: string;
    price: number;
    in_stock: boolean;
    quantity: number;
}
  
export interface RawSupabaseCartProduct {
    id: number;
    price: number;
    main_image_url: string;
    in_stock: boolean;
    product_translations: {
      title: string;
      language_code: string;
    }[];
}

export interface LikedProduct {
    id: number;
    main_image_url: string;
    price: string;
    title: string;
  }
  
  export interface RawLikedProduct {
    id: number;
    main_image_url: string;
    price: string;
    product_translations: { title: string }[];
  }