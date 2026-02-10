'use client';

import { useState, useEffect } from 'react';

interface UseTableCarouselOptions {
  rowsPerPage?: number;
  intervalMs?: number;
}

export function useTableCarousel<T>(
  data: T[] | undefined,
  options: UseTableCarouselOptions = {}
) {
  const { rowsPerPage = 5, intervalMs = 10000 } = options;
  
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;

  // Reset to page 0 when data changes or becomes empty
  useEffect(() => {
    setCurrentPage(0);
  }, [data?.length]);

  // Auto-rotate through pages
  useEffect(() => {
    if (!data || data.length === 0 || totalPages <= 1) {
      return; // Don't rotate if no data or only one page
    }

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        return nextPage >= totalPages ? 0 : nextPage;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [data, totalPages, intervalMs]);

  // Get current page data
  const currentPageData = data
    ? data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
    : undefined;

  // Page info string
  const pageInfo = totalPages > 1 ? `Page ${currentPage + 1} of ${totalPages}` : null;

  return {
    currentPageData,
    currentPage,
    totalPages,
    pageInfo,
  };
}
