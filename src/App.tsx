import PagesListing from "@/components/pageListing";
import PageEditor from "@/components/pageEditor";
import { usePageStore } from "@/lib/store";

function App() {
  const selectedPage = usePageStore().getSelectedPage();

  return (
    <div className="xl:mx-auto xl:max-w-7xl mx-4">
      <h1 className="text-center">Just In Time Pages</h1>
      <PagesListing />
      <hr className="my-2" />
      {selectedPage && <PageEditor key={selectedPage.id} />}
    </div>
  );
}

export default App;
