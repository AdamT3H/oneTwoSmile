import { useState } from "react";
import { UsePaginationOptions } from "../types";

export function usePagination({ totalItems, itemsPerPage, pageRange = 2 }: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startPage = Math.max(currentPage - pageRange, 1);
  const endPage = Math.min(currentPage + pageRange, totalPages);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const resetPage = () => setCurrentPage(1);

  return { currentPage, totalPages, startPage, endPage, goToPage, resetPage };
}