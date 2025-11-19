import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "./ui/separator";
import { usePageStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Edit2Icon, RefreshCwIcon } from "lucide-react";
import { cx } from "class-variance-authority";
import type { Page } from "@/lib/interfaces";

export default function Layout({ children }: { children: React.ReactNode }) {
  const page = usePageStore().getSelectedPage();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex gap-2 items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          {page && <PageTitle page={page} />}
        </header>
        <Separator />
        <div className="@container/main flex flex-1 flex-col">
          <main className="px-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function PageTitle({ page }: { page: Page }) {
  const fetchingPage = usePageStore.use.fetchingPage();
  const fetchSelectedPageData = usePageStore.use.fetchSelectedPageData();
  const isEditingPage = usePageStore.use.isEditingPage();
  const toggleIsEditingPage = usePageStore.use.toggleIsEditingPage();
  const title = page.name || "Untitled Page";
  return (
    <>
      <h2 className="text-2xl font-bold my-2 h-8 w-full flex gap-2 group">
        {title}
        <Button
          className={cx({ "not-group-hover:hidden": !isEditingPage })}
          variant="outline"
          size="icon"
          aria-label="Refresh Data"
          onClick={toggleIsEditingPage}
        >
          <Edit2Icon />
        </Button>
        <Button
          className={cx({ "not-group-hover:hidden": !fetchingPage })}
          variant="outline"
          size="icon"
          aria-label="Refresh Data"
          onClick={fetchSelectedPageData}
          disabled={fetchingPage}
        >
          <RefreshCwIcon className={cx({ "animate-spin": fetchingPage })} />
        </Button>
      </h2>
    </>
  );
}
