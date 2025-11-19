import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";

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
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { Label } from "./ui/label";

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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const skipPageResetRef = useRef(false);

  const table = useReactTable({
    data: fields,
    columns: fieldPropertyColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: !skipPageResetRef.current,
    state: {
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
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
      <div className="overflow-scroll grow">
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
                      <Label className="flex gap-2">
                        {type === "boolean" ? (
                          <Checkbox
                            defaultChecked
                            onCheckedChange={(v) =>
                              toggleAllBooleanField(header.column.id, !!v)
                            }
                          />
                        ) : null}
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Label>
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
      </div>
      <Pagination className="flex-none">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={cx({
                "pointer-events-none opacity-50": !table.getCanPreviousPage(),
              })}
              onClick={(e) => {
                e.preventDefault();
                // table.previousPage();
                if (table.getCanPreviousPage()) setPageIndex(pageIndex - 1);
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
                // table.nextPage();
                if (table.getCanNextPage()) setPageIndex(pageIndex + 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <NativeSelect
              className="text-center"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {["5", "20", table.getCoreRowModel().rows.length].map(
                (pageSize) => (
                  <NativeSelectOption key={pageSize} value={pageSize}>
                    {pageSize}
                  </NativeSelectOption>
                )
              )}
            </NativeSelect>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
