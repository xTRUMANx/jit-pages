import { create } from "zustand";
import { createSelectors } from "@/lib/createSelectors";
import type { FieldProperty, Page } from "@/lib/interfaces";

let nextId = 0;
const initialPages: Page[] = [
  createPage({
    name: "My Repos",
    url: "https://api.github.com/users/xtrumanx/repos",
    fetchDataOnLoad: true,
    fields: [],
  }),
  createPage({
    name: "Random Repo",
    url: "https://api.github.com/repos/xTRUMANx/codenamebuild",
    fetchDataOnLoad: false,
    fields: [],
  }),
];

function createNewPage(name: string) {
  return { name, id: ++nextId, fields: [] };
}

function createPage(page: Page) {
  return { ...page, id: ++nextId, fields: [] };
}

type PageStoreState = {
  pages: Page[];
  selectedPageId: number | null;
  fetchingPage: boolean;
  isEditingPage: boolean;
};

type PageStoreActions = {
  setFetchingPage: (fetching: boolean) => void;
  toggleIsEditingPage: () => void;
  getSelectedPage: () => Page | undefined;
  createPage: (name: string) => void;
  selectPage: (page: Page) => void;
  deletePage: (page: Page) => void;
  updatePage: (page: Page) => void;
  updatePageFields: (page: Page, fields: FieldProperty[]) => void;
  fetchSelectedPageData: () => Promise<void>;
};

type PageStore = PageStoreState & PageStoreActions;

const store = create<PageStore>()((set, get) => ({
  pages: initialPages,
  selectedPageId: 1,
  fetchingPage: false,
  isEditingPage: true,
  setFetchingPage: (fetchingPage) => set({ fetchingPage }),
  toggleIsEditingPage: () =>
    set((state) => ({ isEditingPage: !state.isEditingPage })),
  getSelectedPage: () => {
    var id = get().selectedPageId;

    if (!id) return undefined;

    return get().pages.find((p) => p.id === id);
  },
  createPage: (name) => {
    var newPage = createNewPage(name);
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
  fetchSelectedPageData: async () => {
    const selectedPage = get().getSelectedPage();
    if (!selectedPage) return;

    if (!selectedPage.url) {
      get().updatePage({
        ...{ ...selectedPage, data: "invalid url" },
        id: selectedPage?.id,
      });

      get().setFetchingPage(false);

      return;
    }

    get().setFetchingPage(true);

    var res = await fetch(selectedPage.url.toString());

    get().updatePage({
      ...{ ...selectedPage, data: await res.json() },
      id: selectedPage?.id,
    });

    get().setFetchingPage(false);
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
