export type Service = {
    id: number;
    title: string;
    title_ENG: string;
    title_PL: string;
    description: string;
    description_ENG: string;
    description_PL: string;
    price: number | null;
    price_from: number | null;
    price_to: number | null;
    price_euro: number | null;
    price_usdt: number | null;
    category_id: number;
    photo_before: string;
    photo_after: string;
};
  
export type Category = {
    id: number;
    name: string;
    name_ENG: string;
    name_PL: string;
};