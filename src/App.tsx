import PageEditor from "@/components/pageEditor";
import Layout from "./components/layout";
import Renderer from "./components/renderer";

function App() {

  return (
    <Layout>
      <PageEditor />
      <Renderer />
    </Layout>
  );
}

export default App;
