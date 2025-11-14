import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewPageDialog from "@/components/newPageDialog";
import { usePageStore } from "@/lib/store";
import { Trash2Icon } from "lucide-react";
import { cx } from "class-variance-authority";

function PagesTable({}: {}) {
  const pages = usePageStore.use.pages();
  const selectedPageId = usePageStore.use.selectedPageId();
  const selectPage = usePageStore.use.selectPage();
  const deletePage = usePageStore.use.deletePage();

  if (pages.length === 0) {
    return <p>No pages created yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page, index) => (
          <TableRow key={index} className="odd:bg-muted">
            <TableCell>
              <Button
                className={cx({"underline": page.id === selectedPageId})}
                variant={"link"}
                onClick={() => selectPage(page)}
                children={page.name}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => deletePage(page)}
                children={<Trash2Icon />}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function PagesListing({}: {}) {
  return (
    <>
      <NewPageDialog />
      <PagesTable />
    </>
  );
}
