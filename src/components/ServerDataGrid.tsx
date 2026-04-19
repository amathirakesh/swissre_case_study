import { ReactNode } from 'react';

export interface GridColumn<TItem> {
  id: keyof TItem | string;
  header: string;
  render: (item: TItem) => ReactNode;
}

interface ServerDataGridProps<TItem extends { id: string }> {
  columns: Array<GridColumn<TItem>>;
  rows: TItem[];
  total: number;
  page: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
}

export function ServerDataGrid<TItem extends { id: string }>({
  columns,
  rows,
  total,
  page,
  pageSize,
  isFetching = false,
  onPageChange,
}: ServerDataGridProps<TItem>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="card grid-card">
      <div className="grid-header">
        {columns.map((column) => (
          <span key={String(column.id)}>{column.header}</span>
        ))}
      </div>
      {isFetching ? (
        <div className="grid-skeleton" aria-label="Loading table rows">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="grid-skeleton__row" key={index}>
              {columns.map((column) => (
                <div className="grid-skeleton__cell" key={String(column.id)} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
      {rows.map((row) => (
        <div className="grid-row" key={row.id}>
          {columns.map((column) => (
            <div key={String(column.id)}>{column.render(row)}</div>
          ))}
        </div>
      ))}
      <div className="grid-row">
        <span>
          Page {page} of {totalPages}
        </span>
        <span>{total.toLocaleString()} total records</span>
        <span />
        <span />
        <div className="grid-actions">
          <button className="button button--secondary" type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <button className="button button--secondary" type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
