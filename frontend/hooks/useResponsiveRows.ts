'use client';

import { useState, useEffect } from 'react';

export function useResponsiveRows() {
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const calculateRows = () => {
      const screenHeight = window.innerHeight;
      const headerHeight = 80; // Header bar
      const summaryHeight = 80; // Summary metrics
      const footerHeight = 60; // Footer
      const widgetPadding = 120; // Title + margins + page indicator

      const availableHeight = screenHeight - headerHeight - summaryHeight - footerHeight;
      const heightPerWidget = availableHeight / 2; // 2 rows of widgets
      const heightForTable = heightPerWidget - widgetPadding;

      const rowHeight = 40; // Approximate height per table row
      const calculatedRows = Math.floor(heightForTable / rowHeight);
      const rows = Math.max(3, Math.min(calculatedRows, 15)); // Min 3, max 15

      setRowsPerPage(rows);
    };

    calculateRows();
    window.addEventListener('resize', calculateRows);
    return () => window.removeEventListener('resize', calculateRows);
  }, []);

  return rowsPerPage;
}
