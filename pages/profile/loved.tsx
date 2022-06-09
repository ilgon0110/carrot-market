import type { NextPage } from "next";
import Layout from "@components/layout";
import Item from "@components/item";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout seoTitle="Loved" canGoBack>
      <div className="flex px-4 flex-col space-y-5 py-10">
        <ProductList kind="Fav" />
      </div>
    </Layout>
  );
};

export default Loved;
