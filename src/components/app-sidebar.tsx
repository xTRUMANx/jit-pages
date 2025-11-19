import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePageStore } from "@/lib/store";
import {
  Calendar,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { cx } from "class-variance-authority";
import NewPageDialog from "./newPageDialog";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pages = usePageStore.use.pages();
  const selectedPageId = usePageStore.use.selectedPageId();
  const selectPage = usePageStore.use.selectPage();
  const deletePage = usePageStore.use.deletePage();

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 className="text-center">Just In Time Pages</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <NewPageDialog>
            <SidebarGroupAction title="Add ">
              <Plus /> <span className="sr-only">Create New Page</span>
            </SidebarGroupAction>
          </NewPageDialog>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton
                    isActive={page.id === selectedPageId}
                    onClick={() => selectPage(page)}
                  >
                    {page.name}
                  </SidebarMenuButton>
                  <SidebarMenuAction onClick={() => deletePage(page)}>
                    <Trash2Icon /> <span className="sr-only">Delete</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
