import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  /** Render the cell; defaults to (row as any)[key]. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Stable unique key per row. */
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchPredicate?: (row: T, query: string) => boolean;
  pageSize?: number;
  filters?: ReactNode;
  actions?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  toolbarExtra?: ReactNode;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

/** Enterprise table: search, filters, sorting, pagination. Purely client-side over demo data. */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchable = true,
  searchPlaceholder = "Search…",
  searchPredicate,
  pageSize = 10,
  filters,
  actions,
  emptyState,
  onRowClick,
  className,
  toolbarExtra,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = data;
    if (query && searchable) {
      const q = query.toLowerCase();
      rows = rows.filter((row) =>
        searchPredicate
          ? searchPredicate(row, q)
          : JSON.stringify(row).toLowerCase().includes(q),
      );
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv));
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, query, searchable, searchPredicate, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function toggleSort(col: Column<T>) {
    if (!col.sortable) return;
    setSort((prev) =>
      prev?.key !== col.key
        ? { key: col.key, dir: "asc" }
        : prev.dir === "asc"
          ? { key: col.key, dir: "desc" }
          : null,
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {(searchable || filters || actions || toolbarExtra) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          {searchable && (
            <div className="relative min-w-52 flex-1 max-w-sm">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                className="h-8 bg-surface pl-8 text-xs"
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {filters}
          <div className="ml-auto flex items-center gap-2">
            {toolbarExtra}
            {actions}
          </div>
        </div>
      )}
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-fit text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn("whitespace-nowrap px-4 py-2.5 font-semibold", col.headerClassName)}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-foreground"
                    >
                      {col.header}
                      {sort?.key === col.key &&
                        (sort.dir === "asc" ? (
                          <ArrowUp className="size-3" aria-hidden />
                        ) : (
                          <ArrowDown className="size-3" aria-hidden />
                        ))}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {emptyState ?? "No records match the current filters."}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-border/60 transition-colors last:border-0 hover:bg-surface/70",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("whitespace-nowrap px-4 py-2.5", col.className)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
          {filtered.length !== data.length && ` (filtered from ${data.length})`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="tabular px-1">
            Page {safePage + 1} of {pageCount}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
