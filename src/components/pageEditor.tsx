import { useEffect } from "react";
import { usePageStore } from "@/lib/store";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function PageEditor() {
  const page = usePageStore().getSelectedPage();
  const updatePage = usePageStore.use.updatePage();
  const fetchingPage = usePageStore.use.fetchingPage();
  const fetchSelectedPageData = usePageStore.use.fetchSelectedPageData();
  const isEditingPage = usePageStore.use.isEditingPage();

  useEffect(() => {
    if (page?.fetchDataOnLoad) {
      fetchSelectedPageData();
    }
  }, [page?.id]);

  const form = useForm({
    defaultValues: {
      id: page?.id,
      name: page?.name,
      url: page?.url,
      fetchDataOnLoad: page?.fetchDataOnLoad,
    },
    onSubmit: async ({ value }) => {
      updatePage({
        ...{
          ...value,
          name: value.name!,
          url: value.url!,
          fetchDataOnLoad: value.fetchDataOnLoad,
          fields: [],
        },
        id: page?.id,
      });
    },
  });

  if (!page || !isEditingPage) {
    return null;
  }

  return (
    <form
      key={page.id}
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Page: "{page.name}"</FieldLegend>
          <FieldGroup>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Name is required." : undefined,
              }}
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    key={`${page.id}-name`}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    autoComplete="off"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    The name of the page. Appears as the title of the page.
                  </FieldDescription>
                </Field>
              )}
            />
            <form.Field
              name="url"
              validators={{
                onChange: ({ value }) =>
                  !value ? "URL is required." : undefined,
              }}
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                  <ButtonGroup>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="off"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Button
                      onClick={fetchSelectedPageData}
                      disabled={fetchingPage}
                    >
                      {fetchingPage ? <Spinner /> : null}
                      GET
                    </Button>
                  </ButtonGroup>
                  <FieldDescription>
                    URL to fetch page data from.
                  </FieldDescription>
                </Field>
              )}
            />
            <form.Field
              name="fetchDataOnLoad"
              children={(field) => (
                <Field>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onCheckedChange={() =>
                        field.handleChange(!field.state.value)
                      }
                    />
                    <Label htmlFor={field.name}>Fetch On Load</Label>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <Button type="submit">Submit</Button>
      <hr className="my-2" />
    </form>
  );
}
