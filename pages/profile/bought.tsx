import type { NextPage } from "next";
import Layout from "@components/layout";
import Item from "@components/item";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout seoTitle="Bought" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="Purchase" />
      </div>
    </Layout>
  );
};

export default Bought;
