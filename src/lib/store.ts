import { create } from "zustand";
import { createSelectors } from "@/lib/createSelectors";
import type { FieldProperty, Page } from "@/lib/interfaces";

let nextId = 0;
const initialPages: Page[] = [
  createNewPage({
    name: "My Repos",
    url: "https://api.github.com/users/xtrumanx/repos",
    fields: []
  }),
  createNewPage({
    name: "Random Repo",
    url: "https://api.github.com/repos/xTRUMANx/codenamebuild",
    fields: []
  }),
];

function createNewPage(page: Page) {
  return { ...page, id: ++nextId, };
}

type PageStoreState = {
  pages: Page[];
  selectedPageId: number | null;
};

type PageStoreActions = {
  getSelectedPage: () => Page | undefined;
  createPage: (page: Page) => void;
  selectPage: (page: Page) => void;
  deletePage: (page: Page) => void;
  updatePage: (page: Page) => void;
  updatePageFields: (page: Page, fields: FieldProperty[]) => void;
};

type PageStore = PageStoreState & PageStoreActions;

const store = create<PageStore>()((set, get) => ({
  pages: initialPages,
  selectedPageId: 1,
  getSelectedPage: () => {
    var id = get().selectedPageId;

    if (!id) return undefined;

    return get().pages.find((p) => p.id === id);
  },
  createPage: (page) => {
    var newPage = createNewPage(page);
    set({ pages: [...get().pages, newPage], selectedPageId: newPage.id });
  },
  selectPage: (page) => {
    if (get().selectedPageId === page.id) return;
    set({ selectedPageId: page.id });
  },
  deletePage: (page) => {
    const currentPages = get().pages;
    const newPages = currentPages.filter((p) => p !== page);

    var currentSelectedPageIndex = get().selectedPageId;
    var deletedPageIndex = currentPages.indexOf(page);
    var newSelectedPageIndex = currentSelectedPageIndex;

    if (currentSelectedPageIndex === deletedPageIndex) {
      newSelectedPageIndex = null;
    } else if (
      currentSelectedPageIndex !== null &&
      currentSelectedPageIndex > deletedPageIndex
    ) {
      newSelectedPageIndex = currentSelectedPageIndex - 1;
    }

    set({ pages: newPages, selectedPageId: newSelectedPageIndex });
  },
  updatePage: (page) => {
    var newPages = [...get().pages];
    var pageIndex = newPages.findIndex((p) => p.id === page.id);
    if (pageIndex === -1) return;
    newPages[pageIndex] = { ...page, fields: generateFields(page.data) };
    set({ pages: newPages });
  },
  updatePageFields: (page, fields) => {
    var newPages = [...get().pages];
    var pageIndex = newPages.findIndex((p) => p.id === page.id);
    if (pageIndex === -1) return;
    newPages[pageIndex] = { ...page, fields: fields };
    set({ pages: newPages });
  },
}));

const generateFields = (fetchedData: any) => {
  if (!fetchedData) return [];

  var keys = Array.isArray(fetchedData)
    ? Object.keys(fetchedData[0])
    : typeof fetchedData === "object"
    ? Object.keys(fetchedData)
    : [];

  if (!keys.length) return [];

  return keys.map((k) => ({ key: k, visible: true }));
};

export const usePageStore = createSelectors(store);
