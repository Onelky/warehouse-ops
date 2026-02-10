'use client';

import { useTableCarousel } from '@/hooks/useTableCarousel';

export interface TableColumn<T> {
  header: string;
  dataField: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface CarouselTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[] | undefined;
  rowsPerPage?: number;
  intervalMs?: number;
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
  getRowClassName?: (row: T) => string;
}

export function CarouselTable<T>({
  title,
  columns,
  data,
  rowsPerPage = 5,
  intervalMs = 30000,
  isLoading,
  error,
  emptyMessage = 'No data available',
  getRowKey,
  getRowClassName,
}: CarouselTableProps<T>) {
  const { currentPageData, pageInfo } = useTableCarousel(data, {
    rowsPerPage,
    intervalMs,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-[280px] flex flex-col">
        <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-[280px] flex flex-col">
        <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[280px] flex flex-col">
      <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>

      {!data || data.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm">{emptyMessage}</p>
      ) : (
        <>
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={
                        column.headerClassName ||
                        'text-left py-1 px-2 text-xs font-semibold text-gray-700'
                      }
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPageData?.map((row) => (
                  <tr
                    key={getRowKey(row)}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      getRowClassName ? getRowClassName(row) : ''
                    }`}
                  >
                    {columns.map((column, index) => {
                      const value = row[column.dataField];
                      const displayValue = column.render 
                        ? column.render(value, row) 
                        : (typeof value === 'string' || typeof value === 'number' 
                            ? value 
                            : JSON.stringify(value));
                      return (
                        <td
                          key={index}
                          className={column.className || 'py-2 px-2 text-sm'}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Page indicator */}
          {pageInfo && (
            <div className="mt-2 text-center">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                {pageInfo}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
