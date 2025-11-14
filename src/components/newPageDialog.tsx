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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { usePageStore } from "@/lib/store";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function NewPageDialog() {
  const [open, setOpen] = useState(false);
  const pages = usePageStore.use.pages();
  const createPage = usePageStore.use.createPage();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (pages.find((p) => p.name === value.name)) {
          return {
            fields: {
              name: "Page name must be unique.",
            },
          };
        }

        return null;
      },
    },
    onSubmit: async ({ value }) => {
      createPage({ name: value.name });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Page</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Just need some info to create a new page.
            </DialogDescription>
          </DialogHeader>
          <div>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Name is required." : undefined,
              }}
              children={(field) => {
                return (
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor={field.name}>Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        autoComplete="off"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
            >
              Reset
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Creating page..." : "Create Page"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
