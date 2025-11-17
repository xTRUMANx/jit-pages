import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FieldPropertyTable from "@/components/fieldPropertiesTable";
import type { FieldProperty, Page } from "@/lib/interfaces";
import { usePageStore } from "@/lib/store";

export default function EditFormattingDialog({ page }: { page: Page }) {
  const updatePageFields = usePageStore.use.updatePageFields();
  const fields = page.fields;

  const setFields = (fields: FieldProperty[]) => {
    updatePageFields(page, fields);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Formatting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-11/12 sm:max-h-11/12 sm:m-4 overflow-scroll flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle>Edit Data</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex-none">Edit how data is presented.</DialogDescription>
        <FieldPropertyTable fields={fields} setFields={setFields} />
        <DialogFooter className="mt-4 flex-none">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
