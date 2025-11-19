import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <div className="@container/main flex flex-1 flex-col">
          <main className="px-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
