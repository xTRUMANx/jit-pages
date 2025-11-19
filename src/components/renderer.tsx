import { useMemo } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import type { Page } from "@/lib/interfaces";
import EditFormattingDialog from "@/components/editFormattingDialog";
import { Button } from "./ui/button";
import { usePageStore } from "@/lib/store";
import { Edit2Icon, RefreshCwIcon } from "lucide-react";

export default function Renderer() {
    const page = usePageStore().getSelectedPage();
  
  if (!page) return;

  return (
    <>
      <PageTitle page={page} />
      <EditFormattingDialog page={page} />
      {!page.data ? null : Array.isArray(page.data) ? (
        <DynamicTable page={page} />
      ) : typeof page.data === "object" ? (
        <RenderObject page={page} />
      ) : (
        JSON.stringify(page.data)
      )}
    </>
  );
}

function PageTitle({ page }: { page: Page }) {
  const fetchingPage = usePageStore.use.fetchingPage();
  const fetchSelectedPageData = usePageStore.use.fetchSelectedPageData();
  const toggleIsEditingPage = usePageStore.use.toggleIsEditingPage();
  const title = page.name || "Untitled Page";
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 flex gap-2">
        {title}
        <Button
          variant="outline"
          size="icon"
          aria-label="Refresh Data"
          onClick={fetchSelectedPageData}
          disabled={fetchingPage}
        >
          <RefreshCwIcon className={cx({"animate-spin": fetchingPage})} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Refresh Data"
          onClick={toggleIsEditingPage}
        >
          <Edit2Icon />
        </Button>
      </h2>
    </>
  );
}

function RenderObject({ page }: { page: Page }) {
  var keys = Object.keys(page.data).filter(
    (k) => page.fields.find((f) => f.key === k)?.visible
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {keys.map((k, i) => (
        <div key={k} className="flex flex-col">
          <span className="font-bold" key={`k-${i}}`}>
            {k}
          </span>
          <span key={`v-${i}}`} className="truncate">
            <RenderValue value={page.data[k]} />
          </span>
        </div>
      ))}
    </div>
  );
}

const columnHelper = createColumnHelper<any>();

function DynamicTable({ page }: { page: Page }) {
  const columns = useMemo(() => {
    var keys = Object.keys(page.data[0]);

    return keys.map((k) =>
      columnHelper.accessor(k, {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      })
    );
  }, [page.data]);

  const columnVisibility = useMemo(
    () =>
      page.fields.reduce<{ [key: string]: boolean }>((p, v) => {
        p[v.key] = v.visible;
        return p;
      }, {}),
    [page.fields]
  );

  const table = useReactTable({
    data: page.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="odd:bg-muted">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="max-w-64 truncate">
                  <RenderValue value={cell.getValue()} />
                </TableCell>
              ))}
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
            <p className="pointer-events-none">
              {`Page ${table.getState().pagination.pageIndex + 1} of
              ${table.getPageCount()}`}
            </p>
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

export function RenderValue({ value }: { value: any }) {
  if (value === null || value === undefined) return null;
  return typeof value === "object" ? JSON.stringify(value) : value.toString();
}
