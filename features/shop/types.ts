export interface CartedProduct {
    id: number;
    quantity: number;
}

export interface UsePaginationOptions {
    totalItems: number;
    itemsPerPage: number;
    pageRange?: number;
}
  