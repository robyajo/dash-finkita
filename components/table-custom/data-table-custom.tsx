"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "../data-table/view-options";

interface CustomDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  // Pagination
  page: number;
  totalPage: number;
  totalData: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  // Sorting
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // Column Visibility
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  // Manual Control
  manualSorting?: boolean;
  // Search
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Additional Actions
  renderActions?: React.ReactNode;
  // Variant
  variant?: "card" | "flat";
}

export function CustomDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  error,
  page,
  totalPage,
  totalData,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  manualSorting = true,
  search,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  renderActions,
  variant = "card",
}: CustomDataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    []
  );
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPage,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
      sorting: sorting ?? internalSorting,
      columnVisibility: columnVisibility ?? internalColumnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: page - 1,
          pageSize: pageSize,
        });
        onPageChange(newState.pageIndex + 1);
        if (onPageSizeChange) {
          onPageSizeChange(newState.pageSize);
        }
      }
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function"
          ? updater(sorting ?? internalSorting)
          : updater;
      if (onSortingChange) {
        onSortingChange(nextSorting);
      } else {
        setInternalSorting(nextSorting);
      }
    },
    onColumnVisibilityChange: (updater) => {
      const nextVisibility =
        typeof updater === "function"
          ? updater(columnVisibility ?? internalColumnVisibility)
          : updater;
      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(nextVisibility);
      } else {
        setInternalColumnVisibility(nextVisibility);
      }
    },
    manualPagination: true,
    manualSorting: manualSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Gagal memuat data</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {error || "Terjadi kesalahan saat mengambil data dari server."}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const isFiltered =
    (search && search.length > 0) || table.getState().columnFilters.length > 0;

  const toolbar = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        {onSearchChange && (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className={cn(
                "h-9 pl-8 pr-8",
                variant === "card"
                  ? "bg-background"
                  : "bg-muted/50 border-transparent focus:bg-background"
              )}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <Button
                variant="ghost"
                onClick={() => onSearchChange("")}
                className="absolute right-0 top-0 h-9 px-2 hover:bg-transparent"
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              if (onSearchChange) onSearchChange("");
            }}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {renderActions && (
          <div className="flex items-center gap-2">{renderActions}</div>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );

  const tableContent = (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader
          className={cn(variant === "card" ? "bg-muted/50" : "bg-muted/30")}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 py-2 font-semibold text-foreground"
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : "auto",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((_, j) => (
                  <TableCell key={j} className="px-4 py-4">
                    <Skeleton className="h-5 w-full rounded-full opacity-50" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-3 align-middle"
                    style={{
                      width:
                        cell.column.getSize() !== 150
                          ? cell.column.getSize()
                          : "auto",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="font-medium">Tidak ada data</p>
                  <p className="text-sm">
                    Silakan coba kata kunci lain atau tambah data baru.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const pagination = (
    <DataTablePagination table={table} totalItems={totalData} />
  );

  if (variant === "card") {
    return (
      <Card className="overflow-hidden py-0 gap-0 shadow-sm border">
        <CardContent className="p-2">
          <div className="px-2 py-4 border-b space-y-0">{toolbar}</div>
          {tableContent}
        </CardContent>
        <CardFooter className="px-2 py-4 border-t">
          <div className="w-full">{pagination}</div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {toolbar}
      <div className="rounded-none border-y bg-transparent shadow-none overflow-hidden">
        {tableContent}
      </div>
      {pagination}
    </div>
  );
}
