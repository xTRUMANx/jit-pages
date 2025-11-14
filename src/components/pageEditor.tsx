import { useState } from "react";

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
import Renderer from "@/components/renderer";
import { Spinner } from "@/components/ui/spinner";
import { ButtonGroup } from "@/components/ui/button-group";

export default function PageEditor() {
  const page = usePageStore().getSelectedPage();
  const updatePage = usePageStore.use.updatePage();
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm({
    defaultValues: {
      id: page?.id,
      name: page?.name,
      url: page?.url,
    },
    onSubmit: async ({ value }) => {
      updatePage({
        ...{ ...value, name: value.name!, url: value.url!, fields: [] },
        id: page?.id,
      });
    },
  });

  if (!page) {
    return null;
  }

  const fetchUrl = async () => {
    const url = form.getFieldValue("url")?.toString();

    if (!url) {
      updatePage({
        ...{ ...page, data: "invalid url" },
        id: page?.id,
      });

      setIsFetching(false);

      return;
    }

    setIsFetching(true);

    var res = await fetch(url.toString());

    updatePage({
      ...{ ...page, data: await res.json() },
      id: page?.id,
    });

    setIsFetching(false);
  };

  return (
    <form
      key={page.id}
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
                    <Button onClick={fetchUrl} disabled={isFetching}>
                      {isFetching ? <Spinner /> : null}
                      GET
                    </Button>
                  </ButtonGroup>
                  <FieldDescription>
                    URL to fetch page data from.
                  </FieldDescription>
                </Field>
              )}
            />
            <Renderer page={page} />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
