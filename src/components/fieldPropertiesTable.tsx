import { cx } from "class-variance-authority";
import { useEffect, useRef } from "react";

import type { FieldProperty } from "@/lib/interfaces";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RenderValue } from "@/components/renderer";

const fieldPropertyColumnHelper = createColumnHelper<FieldProperty>();
const fieldPropertyColumns = [
  fieldPropertyColumnHelper.accessor("key", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  fieldPropertyColumnHelper.accessor("visible", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

export default function FieldPropertyTable({
  fields,
  setFields,
}: {
  fields: FieldProperty[];
  setFields: (fields: FieldProperty[]) => void;
}) {
  const skipPageResetRef = useRef(false);

  const table = useReactTable({
    data: fields,
    columns: fieldPropertyColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: !skipPageResetRef.current,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    skipPageResetRef.current = false;
  });

  const toggleBooleanField = (rowIndex: number, columnId: string) => {
    const newFields = [...fields];
    if (columnId === "visible") {
      newFields[rowIndex].visible = !newFields[rowIndex].visible;
    }
    skipPageResetRef.current = true;
    setFields(newFields);
  };

  const toggleAllBooleanField = (columnId: string, value: boolean) => {
    let newFields = [...fields];
    if (columnId === "visible") {
      newFields = newFields.map((f) => ({ ...f, visible: value }));
    }
    setFields(newFields);
  };

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const type = typeof table
                  .getRowModel()
                  .rows[0].getVisibleCells()
                  [index].getValue();

                return (
                  <TableHead key={header.id}>
                    <div className="flex gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {type === "boolean" ? (
                        <Checkbox
                          defaultChecked
                          onCheckedChange={(v) =>
                            toggleAllBooleanField(header.column.id, !!v)
                          }
                        />
                      ) : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="odd:bg-muted">
              {row.getVisibleCells().map((cell) => {
                const value = cell.getValue();
                const type = typeof value;

                return (
                  <TableCell key={cell.id}>
                    {type === "boolean" ? (
                      <Checkbox
                        checked={!!value}
                        onCheckedChange={() =>
                          toggleBooleanField(cell.row.index, cell.column.id)
                        }
                      />
                    ) : (
                      <RenderValue key={cell.id} value={cell.getValue()} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={cx({
                "pointer-events-none opacity-50": !table.getCanPreviousPage(),
              })}
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
            />
          </PaginationItem>
          <PaginationItem>
            {`Page ${table.getState().pagination.pageIndex + 1} of
              ${table.getPageCount()}`}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={cx({
                "pointer-events-none opacity-50": !table.getCanNextPage(),
              })}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
